import { readCSVRecords, resolveSelectedCSV } from "../../lib/csv";
import { consolidateProfiles } from "../../lib/planets";
import PlanetGrid from "../../components/PlanetGrid";
import type { PlanetProfile } from "../../types/planets";

export const dynamic = "force-static";

export default function PlanetsPage() {
  let profiles: PlanetProfile[] = [];
  const csv = resolveSelectedCSV();
  if (csv) {
    try {
      const rows = readCSVRecords(csv);
      profiles = consolidateProfiles(rows);
    } catch {}
  }

  return (
    <main className="min-h-screen bg-[#0b1220]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 pb-16">
        <header className="text-center mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Explore Exoplanets
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search, sort, and explore our curated collection of potentially habitable exoplanets. 
            Generate synthetic variations and dive deep into detailed metrics.
          </p>
        </header>

        <PlanetGrid data={profiles} />

        {!csv ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center mt-12">
            <p className="text-base text-slate-300 mb-3 font-medium">CSV data not found.</p>
            <p className="text-sm text-slate-400 leading-6 max-w-2xl mx-auto">
              Place your file at <code className="px-2 py-1 rounded bg-white/10 text-slate-200 font-mono text-xs">/public/data/selected_planets_full.csv</code> with
              rows from the NASA Exoplanet Archive. Only the specified planet names will be shown.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}

