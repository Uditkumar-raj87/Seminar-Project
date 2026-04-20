# Digital Life Impact Dashboard

A modern, responsive analytics dashboard built with React, Tailwind CSS, and Recharts to explore how digital habits influence sleep, stress, and productivity.

## Overview

This project visualizes relationships between:

- Daily screen time
- Sleep duration and sleep quality
- Stress level
- Productivity level
- Demographic dimensions (gender, age group, profession)

The UI follows a dark, professional analytics style inspired by business intelligence tools.

## Features

- Dark-themed dashboard with responsive grid layout
- KPI cards for key summary metrics
- Interactive global filters:
  - Gender
  - Age Group
  - Profession Type
- Chart suite:
  - Line chart: Screen Time vs Productivity Trends
  - Scatter plot: Screen Time vs Sleep Hours (bubble size = stress)
  - Bar chart: Stress Level by Age Group
  - 100% stacked bar: Eye Strain vs Sleep Quality
  - Heatmap: Screen Time vs Productivity Distribution
  - Profession comparison bars:
    - Daily Screen Time by Profession
    - Social Media Usage by Profession
    - Sleep Hours by Profession
    - Productivity Level by Profession
- Smooth transitions, hover states, and clean legends/tooltips

## Tech Stack

- React (component architecture and state handling)
- Tailwind CSS (utility-first styling)
- Recharts (data visualization)
- Vite (development/build tooling)

## Prerequisites

Make sure the following are installed:

- Node.js 20+
- npm 9+

Check versions:

```bash
node -v
npm -v
```

## Installation

```bash
npm install
```

## Run Locally

Start development server:

```bash
npm run dev
```

Default URL:

```text
http://localhost:5173/
```

## Production Build

Create optimized build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Project Structure

```text
.
├── index.html
├── package.json
├── vite.config.js
└── src
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components
    │   ├── ChartCard.jsx
    │   ├── FilterBar.jsx
    │   ├── HeatmapMatrix.jsx
    │   └── KpiCard.jsx
    └── data
        └── digitalLifeData.js
```

## Data Model

The dashboard currently uses generated mock data shaped like a real dataset. Each record includes:

- `Gender`
- `Age_Group`
- `Profession_Type`
- `Daily_Screen_Time`
- `Social_Media_Time`
- `Sleep_Hours`
- `Stress_Level`
- `Productivity_Level`
- `Productivity_Band`
- `Eye_Strain`
- `Sleep_Quality`

## How Filtering Works

All filters are applied globally. When you select a Gender, Age Group, or Profession Type, KPI cards and all chart datasets are recalculated from the filtered records.

## Customization Notes

- Update theme colors and base layout styles in `src/index.css`.
- Edit chart composition and aggregation logic in `src/App.jsx`.
- Modify dataset generation and category thresholds in `src/data/digitalLifeData.js`.

## Known Notes

- Data is synthetic (mock) and generated for dashboard demonstration.
- Bundle size warning may appear during build due to charting libraries; this does not block execution.

## Deployment

You can deploy this Vite app to platforms such as:

- Vercel
- Netlify
- GitHub Pages (with a suitable Vite base path setup)

Typical flow:

1. Run `npm run build`
2. Deploy the generated `dist/` folder

## Future Improvements

- Add CSV upload/import support
- Add date/time-based trends and drill-down views
- Add export options (PNG/PDF/CSV)
- Add authentication and saved filter presets
