import fs from "node:fs";
import path from "node:path";
import Header from "../../../components/Header";
import { TooltipProvider } from "../../../components/ui/tooltip";
import { CtaRow } from "../../../components/our-methods/CtaRow";
import { ImageCardWithError } from "../../../components/our-methods/ImageCardWithError";

const VARIABLE_CARDS = [
  {
    name: "Planetary Radius",
    code: "pl_rade",
    description:
      "The radius of the planet as a ratio to Earth's radius. Dictates gravity, atmospheric pressure, and the state of water on a planet.",
    units: "Earth radii (R⊕)",
    range: "0.5–1.6 R⊕",
    rationale: "Keeps gravity and pressure within a band where liquid water persists and atmospheres remain stable without crushing biospheres.",
  },
  {
    name: "Planetary Mass",
    code: "pl_bmasse",
    description:
      "The mass of the planet as a ratio to Earth's mass. Determines the ability to maintain a magnetic field, terrestrial state, and maintaining an atmosphere.",
    units: "Earth masses (M⊕)",
    range: "0.2–5 M⊕",
    rationale: "Balances tectonic activity and magnetic shielding; lighter planets lose air, heavier ones risk turning into mini-Neptunes.",
  },
  {
    name: "Stellar Insolation",
    code: "pl_insol",
    description:
      "The amount of light the planet receives compared to Earth per square unit on average. This indicates the climate on the planet.",
    units: "Earth insolation units (S⊕)",
    range: "0.35–1.75 S⊕",
    rationale: "Too little light freezes oceans; too much drives runaway greenhouse feedbacks. This band keeps climates temperate.",
  },
  {
    name: "Equilibrium Temperature",
    code: "pl_eqt",
    description:
      "Estimate of average temperature based on star distance and insolation. Can help to determine surface temperature and cooling or reflection.",
    units: "Kelvin (K)",
    range: "180–310 K",
    rationale: "Anchors median surface temperatures near water's triple point—critical for sustaining liquid reservoirs.",
  },
  {
    name: "Stellar Effective Temperature",
    code: "st_teff",
    description:
      "The surface temperature, flares, and wavelength. Can help determine the radiation stability.",
    units: "Kelvin (K)",
    range: "3500–6500 K",
    rationale: "Targets main-sequence stars mellow enough to avoid sterilizing flares yet bright enough for photosynthesis-compatible spectra.",
  },
  {
    name: "Orbital Eccentricity",
    code: "pl_orbeccen",
    description:
      "The sensitivity of the seasons and climate through the orbit. Lower values can give more stable bodies of water and climate, preventing huge swings or collapses.",
    units: "dimensionless",
    range: "< 0.2",
    rationale: "Limits seasonal extremes so oceans avoid boiling/freezing cycles as the world sweeps around its star.",
  },
];

const HISTOGRAMS = [
  {
    src: "/charts/eccentric.png",
    alt: "Histogram of orbital eccentricity values",
    caption: "Orbital Eccentricity Distribution",
    annotation:
      "Most viable planets cluster below e = 0.1, underscoring the preference for nearly circular orbits that stabilize climate swings.",
  },
  {
    src: "/charts/eq_temp.png",
    alt: "Histogram of equilibrium temperatures",
    caption: "Equilibrium Temperature",
    annotation:
      "A broad peak around 240–270 K indicates temperate worlds; tails on either side illustrate the edges of the habitable comfort zone.",
  },
  {
    src: "/charts/insolation.png",
    alt: "Histogram of stellar insolation",
    caption: "Stellar Insolation",
    annotation:
      "Energy input stays within a narrow corridor—evidence that our thresholds filter out runaway greenhouse or snowball candidates.",
  },
  {
    src: "/charts/mass.png",
    alt: "Histogram of planetary mass",
    caption: "Planetary Mass",
    annotation:
      "The distribution favors super-Earth masses under 5 M⊕, supporting worlds heavy enough to keep atmospheres but light enough to stay rocky.",
  },
  {
    src: "/charts/radius.png",
    alt: "Histogram of planetary radius",
    caption: "Planetary Radius",
    annotation:
      "A steep drop beyond 1.6 R⊕ shows where planets transition toward mini-Neptunes—our cut keeps the sample terrestrially biased.",
  },
  {
    src: "/charts/star_teff.png",
    alt: "Histogram of stellar effective temperatures",
    caption: "Stellar Effective Temperature",
    annotation:
      "Cool K- and warm G-type hosts dominate, pointing to stars that balance longevity with spectral quality.",
  },
];

const RULE_ROWS = [
  { variable: "Planetary Radius", pass: 169, fail: 28 },
  { variable: "Planetary Mass", pass: 161, fail: 36 },
  { variable: "Stellar Insolation", pass: 194, fail: 3 },
  { variable: "Equilibrium Temperature", pass: 193, fail: 4 },
  { variable: "Stellar Effective Temperature", pass: 167, fail: 30 },
  { variable: "Orbital Eccentricity", pass: 167, fail: 30 },
];

const CURATED_ASSET_PATHS = new Set(HISTOGRAMS.map((item) => item.src));
const SUPPLEMENTAL_GRAPHS = readSupplementalGraphs(CURATED_ASSET_PATHS);
const PUBLIC_CHARTS = readPublicCharts(CURATED_ASSET_PATHS);

function resolveCsv(pathFragment: string) {
  const candidate = path.join(process.cwd(), "public", pathFragment);
  try {
    return fs.existsSync(candidate);
  } catch {
    return false;
  }
}

export default function OurMethodsPage() {
  const hasSelectedCsv = resolveCsv("data/selected_planets_full.csv");
  const hasRawCsv = resolveCsv("data/rawdata.csv");

  return (
    <TooltipProvider delayDuration={150}>
      <main className="min-h-screen bg-[#0b1220]">
        <Header />

        {/* Hero Section - Page Header */}
        <section className="border-b border-white/5 pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">
              Our Methodology
            </p>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              Our Methods
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-300 sm:text-2xl">
              A rigorous, data-driven approach to identifying potentially habitable exoplanets
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="border-b border-white/5 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
                Systematic Screening Process
              </h2>
              <p className="text-lg leading-relaxed text-slate-300">
                We employ a systematic screening process based on six critical parameters that determine 
                a planet's potential to support life. Each threshold is carefully calibrated to identify 
                worlds within the habitable zone—where liquid water could exist and conditions might be 
                suitable for life as we know it.
              </p>
            </div>
          </div>
        </section>

        {/* Variables Section - Main Content */}
        <section className="border-b border-white/5 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">
                Part 1: Screening Criteria
              </p>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Six Key Variables
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300">
                Each parameter plays a crucial role in determining planetary habitability. These thresholds 
                filter our dataset to identify the most promising candidates.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VARIABLE_CARDS.map((card) => (
                <ModernStatCard key={card.code} {...card} />
              ))}
            </div>
          </div>
        </section>

        {/* Data Visualization Section - Constrained Images */}
        <section className="border-b border-white/5 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">
                Part 2: Data Analysis
              </p>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Distribution Patterns
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300">
                These histograms reveal how our screening thresholds shape the dataset. Each chart 
                illustrates the distribution of a key variable across filtered planets.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {HISTOGRAMS.map((item) => (
                <ImageCardWithError key={item.caption} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Screening Results Section - Before Supplemental Content */}
        <section className="border-b border-white/5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">
                Part 3: Results
              </p>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Screening Results
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300">
                Statistics showing how many planets pass or fail each screening criterion. A planet must 
                meet all thresholds to be considered potentially habitable.
              </p>
            </div>
            <ModernRuleTable rows={RULE_ROWS} />
          </div>
        </section>

        {/* Supplemental Graphs - Secondary Content */}
        {SUPPLEMENTAL_GRAPHS.length > 0 && (
          <section className="border-b border-white/5 py-20 sm:py-28 bg-white/[0.01]">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 text-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                  Extended Analysis
                </p>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Supplementary Visualizations
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400">
                  Additional analysis and notebook exports providing deeper insights into our methodology.
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {SUPPLEMENTAL_GRAPHS.map((graph) => (
                  <ImageCardWithError key={graph.src} {...graph} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Public Charts - Tertiary Content */}
        {PUBLIC_CHARTS.length > 0 && (
          <section className="border-b border-white/5 py-20 sm:py-28 bg-white/[0.01]">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 text-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                  Resources
                </p>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Shared Chart Library
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400">
                  Additional visualizations available for exploration and analysis.
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {PUBLIC_CHARTS.map((chart) => (
                  <ImageCardWithError key={chart.src} {...chart} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section - Final Action */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">
                Explore Further
              </p>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Ready to Dive Deeper?
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300">
                Explore our curated planet collection or download the datasets to conduct your own analysis.
              </p>
            </div>
            <div className="mt-12">
              <CtaRow hasSelectedCsv={hasSelectedCsv} hasRawCsv={hasRawCsv} />
            </div>
          </div>
        </section>
      </main>
    </TooltipProvider>
  );
}

// Modern Stat Card Component
function ModernStatCard({
  name,
  code,
  description,
  units,
  range,
  rationale,
}: {
  name: string;
  code: string;
  description: string;
  units: string;
  range: string;
  rationale: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/[0.02] p-6 text-center transition-all duration-300 hover:bg-white/[0.04] hover:shadow-xl border border-white/5">
      <div className="mb-4">
        <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          {code}
        </span>
      </div>
      <h3 className="mb-3 text-xl font-bold text-white">{name}</h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-300">{description}</p>
      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-400">Units</span>
          <span className="font-semibold text-white">{units}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-400">Range</span>
          <span className="font-semibold text-indigo-300">{range}</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs leading-relaxed text-slate-400">{rationale}</p>
      </div>
    </div>
  );
}

// Modern Rule Table Component
function ModernRuleTable({ rows }: { rows: typeof RULE_ROWS }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:bg-white/[0.03] hover:shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider text-slate-300">
                Variable
              </th>
              <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider text-slate-300">
                Pass
              </th>
              <th className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-wider text-slate-300">
                Fail
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, idx) => (
              <tr
                key={row.variable}
                className="transition-colors duration-200 hover:bg-white/[0.02]"
              >
                <td className="px-6 py-5 text-center text-base font-medium text-white">{row.variable}</td>
                <td className="px-6 py-5 text-center text-base font-semibold text-emerald-400">
                  {row.pass}
                </td>
                <td className="px-6 py-5 text-center text-base font-medium text-rose-400">
                  {row.fail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type GraphAsset = {
  src: string;
  alt: string;
  caption: string;
  annotation: string;
};

function readSupplementalGraphs(curated: Set<string>): GraphAsset[] {
  return collectGraphAssets(["graphs", path.join("images", "our-methods")], curated);
}

function readPublicCharts(curated: Set<string>): GraphAsset[] {
  return collectGraphAssets(["charts"], curated);
}

function collectGraphAssets(folders: string[], curated: Set<string>): GraphAsset[] {
  const publicRoot = path.join(process.cwd(), "public");
  const seen = new Set<string>();
  const assets: GraphAsset[] = [];

  const walk = (relativeDir: string) => {
    const fullDir = path.join(publicRoot, relativeDir);
    if (!fs.existsSync(fullDir)) return;
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(fullDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const childRel = path.join(relativeDir, entry.name);
      if (entry.isDirectory()) {
        walk(childRel);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!/\.(png|jpg|jpeg|webp|gif)$/i.test(entry.name)) continue;
      const webPath = `/${childRel.split(path.sep).join("/")}`;
      if (curated.has(webPath) || seen.has(webPath)) continue;
      seen.add(webPath);
      const base = entry.name.replace(/\.[^.]+$/, "");
      const title = toTitleCase(base.replace(/[-_]/g, " "));
      assets.push({
        src: webPath,
        alt: `${title} graph`,
        caption: title,
        annotation: `Full-size export generated from the notebooks showing ${title.toLowerCase()}.`,
      });
    }
  };

  for (const folder of folders) {
    walk(folder);
  }

  return assets;
}

function toTitleCase(input: string) {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
