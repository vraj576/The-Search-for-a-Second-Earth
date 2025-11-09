import path from "node:path";
import fs from "node:fs";
import SpiderRadar, { RadarDatum } from "../components/SpiderRadar";
import PlanetRadarExplorer from "../components/PlanetRadarExplorer";
import FeaturedPlanetsRow from "../components/FeaturedPlanetsRow";
import Header from "../components/Header";
import { readCSVRecords as readSelected, resolveSelectedCSV } from "../lib/csv";
import { consolidateProfiles, ALLOWED_PLANETS } from "../lib/planets";
import type { DensityBinDatum } from "../components/DensityHistogramChart";
// Note: Plotly implementation below is used for rendering
import DensityHistogramPlotly from "../components/DensityHistogramPlotly";

type Row = Record<string, string>;

// Categories and ranges (match the Python version)
const CATEGORIES: { label: string; min: number; max: number; key: string }[] = [
  { label: "Radius", min: 0.5, max: 1.6, key: "pl_rade" },
  { label: "Mass", min: 0.2, max: 5.0, key: "pl_bmasse" },
  { label: "Insolation", min: 0.35, max: 1.75, key: "pl_insol" },
  { label: "Eq. Temp", min: 180, max: 310, key: "pl_eqt" },
  { label: "Solar Eff. Temp", min: 3500, max: 6500, key: "st_teff" },
  { label: "Eccentricity", min: 0.0, max: 0.2, key: "pl_orbeccen" },
];

function normalize(val: number, min: number, max: number) {
  const n = (val - min) / (max - min);
  return Math.max(0, Math.min(1, n));
}

function splitCSVLine(line: string): string[] {
  // Split by commas not inside quotes
  const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  return parts.map((s) => s.replace(/^"|"$/g, "").replace(/""/g, '"'));
}

function readCSVRecords(filePath: string): Row[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = splitCSVLine(lines[0]);
  const records: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    const row: Row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = cols[j] ?? "";
    }
    records.push(row);
  }
  return records;
}

function getRadarDataForPlanet(records: Row[], planetName: string): RadarDatum[] | null {
  const candidates = records.filter((r) => (r["pl_name"] || "").trim() === planetName);
  if (candidates.length === 0) return null;

  // Prefer rows with default_flag === '1'
  const ordered = [
    ...candidates.filter((r) => (r["default_flag"] || "").trim() === "1"),
    ...candidates.filter((r) => (r["default_flag"] || "").trim() !== "1"),
  ];

  for (const row of ordered) {
    const data: RadarDatum[] = [];
    let ok = true;
    for (const c of CATEGORIES) {
      const rawStr = row[c.key];
      if (rawStr == null || rawStr === "") {
        ok = false;
        break;
      }
      const raw = Number.parseFloat(rawStr);
      if (!Number.isFinite(raw)) {
        ok = false;
        break;
      }
      const nPlanet = normalize(raw, c.min, c.max);
      const earthRaw = EARTH_TARGETS[c.key];
      const nEarth = normalize(earthRaw, c.min, c.max);
      const diff = Math.abs(nPlanet - nEarth);
      data.push({
        axis: c.label,
        value: diff, // absolute normalized difference to Earth
        raw,
        range: [c.min, c.max],
        earthRaw,
        earthNorm: nEarth,
      });
    }
    if (ok) return data;
  }
  return null;
}

// Earth target raw values for similarity calculation
const EARTH_TARGETS: Record<string, number> = {
  pl_rade: 1.0,
  pl_bmasse: 1.0,
  pl_insol: 1.0,
  pl_eqt: 255.0, // K (equilibrium temperature)
  st_teff: 5772.0, // K (solar effective temperature)
  pl_orbeccen: 0.0167,
};

function earthNormalizedVector(): number[] {
  return CATEGORIES.map((c) => normalize(EARTH_TARGETS[c.key], c.min, c.max));
}

type PlanetItem = { name: string; data: RadarDatum[]; score: number };

function collectPlanetItems(records: Row[]): PlanetItem[] {
  const groups = new Map<string, Row[]>();
  for (const r of records) {
    const name = (r["pl_name"] || "").trim();
    if (!name) continue;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name)!.push(r);
  }

  const target = earthNormalizedVector();
  const items: PlanetItem[] = [];

  for (const [name, rows] of groups) {
    const ordered = [
      ...rows.filter((r) => (r["default_flag"] || "").trim() === "1"),
      ...rows.filter((r) => (r["default_flag"] || "").trim() !== "1"),
    ];
    for (const row of ordered) {
      // Ensure completeness of required fields
      let ok = true;
      const values: number[] = [];
      const radar: RadarDatum[] = [];
      for (const c of CATEGORIES) {
        const rawStr = row[c.key];
        if (rawStr == null || rawStr === "") {
          ok = false;
          break;
        }
        const raw = Number.parseFloat(rawStr);
        if (!Number.isFinite(raw)) {
          ok = false;
          break;
        }
        const nPlanet = normalize(raw, c.min, c.max);
        const earthRaw = EARTH_TARGETS[c.key];
        const nEarth = normalize(earthRaw, c.min, c.max);
        const diff = Math.abs(nPlanet - nEarth);
        values.push(nPlanet);
        radar.push({ axis: c.label, value: diff, raw, range: [c.min, c.max], earthRaw, earthNorm: nEarth });
      }
      if (!ok) continue;
      // Distance to Earth normalized vector (Euclidean)
      let d2 = 0;
      for (let i = 0; i < values.length; i++) {
        const d = values[i] - target[i];
        d2 += d * d;
      }
      const score = Math.sqrt(d2);
      items.push({ name, data: radar, score });
      break; // take first valid row per planet
    }
  }

  items.sort((a, b) => a.score - b.score);
  return items;
}

function resolveDataPath(): string | null {
  const envPath = process.env.DATA_CSV_PATH;
  const candidates = [
    envPath,
    // Preferred location inside the app's public folder
    path.join(process.cwd(), "public", "data", "rawdata.csv"),
    path.join(process.cwd(), "public", "rawdata.csv"),
    path.join(process.cwd(), "rawdata.csv"),
    path.join(process.cwd(), "..", "rawdata.csv"),
    path.join(process.cwd(), "..", "..", "rawdata.csv"),
  ].filter((p): p is string => !!p);
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return null;
}

export default function BackgroundPage() {
  // Read dataset on the server and build radar data for the default planet
  const datasetPath = resolveDataPath();
  let radarData: RadarDatum[] | null = null;
  let planetTitle = "GJ 1132 b";
  let planetItems: PlanetItem[] = [];
  let errorReason: string | null = null;
  let densityBins: DensityBinDatum[] = [];
  let densitySeries: { terrestrial: number[]; gaseous: number[] } = { terrestrial: [], gaseous: [] };
  let featuredProfiles: any[] = [];
  try {
    if (!datasetPath) {
      errorReason = "CSV not found (public/data/rawdata.csv)";
    } else {
      const records = readCSVRecords(datasetPath);
      planetItems = collectPlanetItems(records);
      const data = getRadarDataForPlanet(records, planetTitle);
      if (!data) errorReason = "Planet not found or incomplete data";
      else radarData = data;

      // Compute density histogram bins
      densityBins = computeDensityBins(records, 30);
      densitySeries = computeDensitySeries(records);
    }

    // Load curated featured planets if present
    const selPath = resolveSelectedCSV();
    if (selPath) {
      const selRows = readSelected(selPath);
      featuredProfiles = consolidateProfiles(selRows).filter((p) => ALLOWED_PLANETS.has(p.pl_name));
    }
  } catch (e) {
    errorReason = "Error reading CSV";
    radarData = null;
  }

  return (
    <main className="min-h-screen bg-[#0b1220]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 pb-16">
        <Header />

        {/* Data visualization: Spider (Radar) Graph */}
        <section id="visualizations" className="scroll-mt-24 pt-20 sm:pt-24 md:pt-28">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Data Visualizations
              </h2>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 space-y-6">
              {planetItems.length > 0 ? (
                <PlanetRadarExplorer items={planetItems} initialSelected={planetTitle} />
              ) : (
                <>
                  {radarData ? (
                    <SpiderRadar title={planetTitle} data={radarData} />
                  ) : (
                    <div className="aspect-[16/9] grid place-items-center rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-300 text-base">
                        Spider graph unavailable ({errorReason ?? "unknown reason"}).
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="max-w-3xl mx-auto pt-4">
                <p className="text-base text-slate-300 leading-7">
                  The interactive menu places planets by similarity to Earth—planets closer to the center are more similar to our home world. 
                  The radar chart axes show the absolute normalized difference from Earth's values; a smaller radius indicates a more Earth-like planet 
                  across the measured characteristics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Density Distribution */}
        <section id="density" className="scroll-mt-24 pt-20 sm:pt-24 md:pt-28">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Planet Density Distribution
              </h2>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 space-y-6">
              {densitySeries.terrestrial.length + densitySeries.gaseous.length > 0 ? (
                <DensityHistogramPlotly terrestrial={densitySeries.terrestrial} gaseous={densitySeries.gaseous} />
              ) : (
                <div className="aspect-[16/9] grid place-items-center rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-300 text-base">
                    Density histogram unavailable ({errorReason ?? "unknown reason"}).
                  </span>
                </div>
              )}
              <div className="max-w-3xl mx-auto pt-4">
                <p className="text-base text-slate-300 leading-7">
                  Planet densities are computed from reported mass and radius measurements. We classify planets with 
                  density ≥ 3 g/cm³ as <span className="text-amber-400 font-medium">terrestrial</span> and those below 
                  as <span className="text-blue-400 font-medium">gaseous</span>. The overlapping bars show the distribution 
                  for each classification, helping us understand the composition diversity of exoplanets in our dataset.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Planets Row */}
        <section id="featured" className="scroll-mt-24 pt-20 sm:pt-24 md:pt-28">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Potential Habitable Planets
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Explore our curated selection of exoplanets that show promise for habitability based on our screening criteria.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8">
              {featuredProfiles.length > 0 ? (
                <FeaturedPlanetsRow profiles={featuredProfiles as any} />
              ) : (
                <div className="grid place-items-center py-12 text-center">
                  <p className="text-slate-300 text-base mb-2">
                    No featured planets data available.
                  </p>
                  <p className="text-slate-400 text-sm">
                    Add the curated CSV at <code className="px-2 py-1 rounded bg-white/10 text-slate-200 font-mono text-xs">/public/data/selected_planets_full.csv</code> to display featured planets.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// ------------------------- Density helpers (server) -------------------------

function computeDensityBins(records: Row[], nbins = 30): DensityBinDatum[] {
  const EARTH_MASS_KG = 5.972e24;
  const EARTH_RADIUS_M = 6.371e6;
  type RowD = { d: number; type: "Terrestrial" | "Gaseous" };
  const values: RowD[] = [];
  for (const r of records) {
    const mStr = (r["pl_bmasse"] || "").trim();
    const radStr = (r["pl_rade"] || "").trim();
    if (!mStr || !radStr) continue;
    const m = Number.parseFloat(mStr);
    const rad = Number.parseFloat(radStr);
    if (!Number.isFinite(m) || !Number.isFinite(rad) || rad <= 0) continue;
    const densityKgM3 = (m * EARTH_MASS_KG) / ((4 / 3) * Math.PI * Math.pow(rad * EARTH_RADIUS_M, 3));
    const d = densityKgM3 / 1000; // g/cm^3
    const type = d >= 3 ? "Terrestrial" : "Gaseous";
    if (Number.isFinite(d)) values.push({ d, type });
  }
  if (values.length === 0) return [];

  // Determine bin edges
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v.d < min) min = v.d;
    if (v.d > max) max = v.d;
  }
  // Clamp extremes to reasonable range
  min = Math.max(0, isFinite(min) ? min : 0);
  max = Math.min(20, isFinite(max) ? max : 20);
  if (!(max > min)) {
    max = min + 1;
  }

  const step = (max - min) / nbins;
  const bins: DensityBinDatum[] = [];
  for (let i = 0; i < nbins; i++) {
    const start = min + i * step;
    const end = i === nbins - 1 ? max : start + step;
    bins.push({ binLabel: ((start + end) / 2).toFixed(2), binStart: start, binEnd: end, terrestrial: 0, gaseous: 0 });
  }

  for (const v of values) {
    let idx = Math.floor((v.d - min) / step);
    if (idx < 0) idx = 0;
    if (idx >= nbins) idx = nbins - 1;
    if (v.type === "Terrestrial") bins[idx].terrestrial += 1;
    else bins[idx].gaseous += 1;
  }

  // Add readable labels like "a–b"
  for (let i = 0; i < bins.length; i++) {
    const b = bins[i];
    b.binLabel = `${b.binStart.toFixed(1)}–${b.binEnd.toFixed(1)}`;
  }
  return bins;
}

function computeDensitySeries(records: Row[]): { terrestrial: number[]; gaseous: number[] } {
  const EARTH_MASS_KG = 5.972e24;
  const EARTH_RADIUS_M = 6.371e6;
  const terrestrial: number[] = [];
  const gaseous: number[] = [];
  for (const r of records) {
    const mStr = (r["pl_bmasse"] || "").trim();
    const radStr = (r["pl_rade"] || "").trim();
    if (!mStr || !radStr) continue;
    const m = Number.parseFloat(mStr);
    const rad = Number.parseFloat(radStr);
    if (!Number.isFinite(m) || !Number.isFinite(rad) || rad <= 0) continue;
    const densityKgM3 = (m * EARTH_MASS_KG) / ((4 / 3) * Math.PI * Math.pow(rad * EARTH_RADIUS_M, 3));
    let d = densityKgM3 / 1000; // g/cm^3
    if (!Number.isFinite(d)) continue;
    // Clamp to a reasonable plotting range to avoid crazy outliers affecting auto-binning
    if (d < 0) d = 0;
    if (d > 20) d = 20;
    if (d >= 3) terrestrial.push(d);
    else gaseous.push(d);
  }
  return { terrestrial, gaseous };
}
