# The Search for a Second Earth

An interactive web application for exploring and analyzing exoplanets that could potentially be habitable, Earth-like worlds. This project visualizes data from the NASA Exoplanet Archive and helps identify planets with characteristics similar to Earth across multiple habitability metrics.

## 🌍 Overview

This project provides a comprehensive platform for discovering and analyzing exoplanets using a scientific filtering approach based on key habitability factors:

- **Planetary Radius** (0.5–1.6 R⊕)
- **Planetary Mass** (0.2–5 M⊕)
- **Stellar Insolation** (0.35–1.75 S⊕)
- **Equilibrium Temperature** (180–310 K)
- **Stellar Effective Temperature** (3500–6500 K)
- **Orbital Eccentricity** (< 0.2)

## ✨ Features

### Interactive Planet Explorer
- **Radar/Spider Charts**: Visual comparison of planets to Earth across six key metrics
- **Similarity Scoring**: Euclidean distance-based ranking system to identify the most Earth-like planets
- **Planet Density Distribution**: Histogram visualization showing the distribution of terrestrial vs. gaseous planets
- **Featured Planets**: Showcase of potential habitable planets with detailed profiles

### Planet Grid
- **Search & Filter**: Find planets by name or characteristics
- **Sort & Compare**: Organize planets by various metrics
- **Synthetic Planet Generation**: Create hypothetical planet profiles based on existing data
- **Detailed Metrics**: View comprehensive statistics including median, percentile ranges, and sample data

### Methods Documentation
- **Screening Criteria**: Detailed explanation of each habitability factor
- **Data Visualizations**: Histograms and charts showing the distribution of key variables
- **Scientific Rationale**: Justification for each threshold and range

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd The-Search-for-a-Second-Earth
```

2. Install dependencies:
```bash
npm install
```

This will install dependencies for both the root workspace and the website application.

### Data Setup

Place your exoplanet data CSV files in the appropriate locations:

1. **Raw Data**: `Visualization/Website/public/data/rawdata.csv`
   - Main dataset from NASA Exoplanet Archive
   - Should include columns: `pl_name`, `pl_rade`, `pl_bmasse`, `pl_insol`, `pl_eqt`, `st_teff`, `pl_orbeccen`, etc.

2. **Selected Planets** (optional): `Visualization/Website/public/data/selected_planets_full.csv`
   - Curated list of potential habitable planets
   - Enables the featured planets section and planet grid

### Running the Application

From the project root:

```bash
npm run dev
```

Or from the website directory:

```bash
cd Visualization/Website
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Run production server
- `npm run typecheck` - TypeScript type checking

## 📁 Project Structure

```
The-Search-for-a-Second-Earth/
├── Visualization/
│   └── Website/              # Next.js application
│       ├── public/
│       │   ├── data/         # CSV data files
│       │   ├── charts/       # Chart images
│       │   └── images/       # Image assets
│       ├── src/
│       │   ├── app/          # Next.js App Router pages
│       │   │   ├── page.tsx           # Home page with visualizations
│       │   │   ├── planets/           # Planet grid page
│       │   │   └── our-methods/       # Methods documentation
│       │   ├── components/   # React components
│       │   ├── lib/          # Utility functions
│       │   └── types/        # TypeScript type definitions
│       └── package.json
├── 2ndEarth.ipynb            # Jupyter notebook (analysis)
├── Visualcode.ipynb          # Jupyter notebook (visualization)
├── final_planets.csv         # Final planet dataset
└── package.json              # Root workspace configuration
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Visualizations**: Plotly.js, React Plotly.js, Recharts
- **Animations**: Framer Motion
- **Data Processing**: PapaParse (CSV parsing)
- **UI Components**: Custom components built with Tailwind CSS

## 📊 Data Sources

This project uses data from the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/), specifically:

- Planetary properties (radius, mass, orbital parameters)
- Stellar properties (effective temperature, insolation)
- Habitability metrics and classifications

## 🎯 Key Metrics

The application evaluates planets based on six key metrics:

1. **Radius (pl_rade)**: 0.5–1.6 Earth radii
2. **Mass (pl_bmasse)**: 0.2–5 Earth masses
3. **Insolation (pl_insol)**: 0.35–1.75 Earth insolation units
4. **Equilibrium Temperature (pl_eqt)**: 180–310 K
5. **Stellar Effective Temperature (st_teff)**: 3500–6500 K
6. **Orbital Eccentricity (pl_orbeccen)**: < 0.2

Each metric is normalized and compared to Earth's values to calculate a similarity score.

## 📝 Pages

- **Home** (`/`): Main dashboard with radar charts, density distribution, and featured planets
- **Planets** (`/planets`): Interactive grid of all planets with search, filter, and synthesis capabilities
- **Our Methods** (`/our-methods`): Detailed documentation of screening criteria and data visualizations

## 👥 Contributors

- Jason
- Aneesh
- Josh
- Vraj

## 📄 License

MIT License

## 🔗 Additional Resources

- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Plotly.js Documentation](https://plotly.com/javascript/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or inquiries, please open an issue on the repository.

---

**Note**: This project is for educational and research purposes. The habitability assessments are based on current scientific understanding and may be updated as new data becomes available.

