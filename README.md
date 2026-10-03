<div align="center">

# 🌊 AquaGuard AI
### Satellite-Powered Water Quality & Harmful Algal Bloom (HAB) Early Warning System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>A real-time remote-sensing dashboard designed to detect algal blooms, turbidity, and ecological risks in drinking water reservoirs using ESA Copernicus Sentinel-2 satellite data and physical band-math modeling.</b>
</p>

[Key Features](#-key-features) •
[Architecture](#-system-architecture) •
[Band Math & Science](#-satellite-physics--band-math) •
[Local Setup](#-getting-started-locally) •
[Deployment Guide](#-deployment) •
[API Reference](#-api-endpoints)

---

</div>

## 📌 Overview

Harmful Algal Blooms (HABs) and sudden silt runoffs pose critical threats to municipal drinking water treatment facilities. Cyanobacteria (blue-green algae) produce dangerous cyanotoxins (e.g., Microcystin) and taste/odor compounds (MIB & Geosmin) that clog filtration beds, spike chemical treatment expenses, and compromise drinking water safety.

**AquaGuard AI** provides plant operators, civil engineers, and environmental scientists with:
- **Instant Early Warning:** Detect bloom inception up to 10 days before visible surface scum forms.
- **Satellite Multi-Spectral Processing:** Direct ingestion and band math calculation from ESA Copernicus Sentinel-2 Level-2A imagery.
- **Actionable Treatment Mitigations:** Direct operational recommendations (sluice gate depth shifting, powdered activated carbon dosage, ultrasonic treatment buoys).
- **Environmental Stress Test Simulator:** A "What-If" climate scenario sandbox to simulate how heatwaves, nutrient spikes, and post-monsoon runoff trigger rapid eutrophication.

---

## ✨ Key Features

- 🛰️ **Interactive GIS Map Viewer:** Custom Leaflet-based geospatial reservoir mapping with dynamic risk zones (Safe / Moderate / Critical), polygon boundaries, and basemap switcher (Satellite, Obsidian GIS, Topographic).
- 🧪 **Multi-Index Spectral Analysis:** Real-time computation of **NDWI**, **FAI**, **NDTI**, and **NDVI** with historical trends and WHO potable limit benchmarks.
- ⚡ **What-If Simulation Sandbox:** Interactively tune parameters in real time:
  - *Nutrient Spike Multiplier* ($0.5\times$ to $3.5\times$)
  - *Water Temperature Anomaly* ($-2^\circ\text{C}$ to $+7^\circ\text{C}$)
  - *Rainfall Runoff Duration* ($0$ to $15$ days)
  - *Daily Sunlight Exposure* ($4$ to $12$ hours)
- 📋 **Water Utility Response Playbook:** Dynamic operational checklists mapped directly to current threat levels (intake depth adjustment, PAC dosing, aeration cascades).
- 📄 **Executive Reporting Engine:** One-click PDF report generation (via ReportLab) and raw CSV data export for municipal water board records.
- 🛡️ **Zero-Downtime Fallback GIS:** Built-in high-fidelity synthetic model guarantees full platform functionality even when Google Earth Engine credentials are off-line or rate-limited.

---

## 🛰️ Satellite Physics & Band Math

AquaGuard AI utilizes surface reflectance bands from the **Sentinel-2 MSI (Multi-Spectral Instrument)** sensor:

| Spectral Index | Formula | Target & Operational Importance |
| :--- | :--- | :--- |
| **NDWI** (Normalized Difference Water Index) | $\frac{\text{B3 (Green)} - \text{B8 (NIR)}}{\text{B3} + \text{B8}}$ | Delineates water-land boundaries (> 0.10 threshold isolates open water). |
| **FAI** (Floating Algae Index) | $\text{B8} - \left[ \text{B4} + (\text{B11} - \text{B4}) \times \frac{842 - 665}{1610 - 665} \right]$ | Identifies floating surface cyanobacteria mats; eliminates cloud & sun-glint noise. |
| **NDTI** (Normalized Difference Turbidity Index) | $\frac{\text{B4 (Red)} - \text{B3 (Green)}}{\text{B4} + \text{B3}}$ | Estimates suspended particulate matter and post-storm siltation. |
| **NDVI** (Normalized Difference Vegetation Index) | $\frac{\text{B8 (NIR)} - \text{B4 (Red)}}{\text{B8} + \text{B4}}$ | Quantifies shoreline macrophytes and dense vegetative biomass. |

---

## 🏗️ System Architecture

```text
       ┌────────────────────────────────────────────────────────┐
       │             User Browser / Water Utility Client        │
       └───────────────────────────┬────────────────────────────┘
                                   │ HTTPS / REST API
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │             Frontend Application (Vercel)              │
       │   • React 18 + Vite + TypeScript                       │
       │   • Tailwind CSS (Obsidian & Emerald UI)               │
       │   • React-Leaflet GIS & Recharts Visualizations        │
       └───────────────────────────┬────────────────────────────┘
                                   │ /api/ requests
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │             Backend API Service (Render)               │
       │   • Python 3.11 + FastAPI + Uvicorn                    │
       │   • Bio-Optical Algorithms & Threat Evaluator          │
       │   • ReportLab PDF Engine & CSV Generator               │
       └──────────────┬───────────────────────────┬─────────────┘
                      │                           │
          Live Sentinel-2 Feeds         Fallback Engine
                      ▼                           ▼
        ┌─────────────────────────┐  ┌─────────────────────────┐
        │   Google Earth Engine   │  │   Synthetic GIS Engine  │
        │   Sentinel-2 Level-2A   │  │ (Deterministic Models)  │
        └─────────────────────────┘  └─────────────────────────┘
```

---

## 📁 Repository Structure

```text
Water_Quality/
├── backend/
│   ├── main.py                  # FastAPI application entrypoint & API endpoints
│   ├── models.py                # Pydantic data schemas & response validation
│   ├── gee_service.py           # Google Earth Engine Sentinel-2 ingestion pipeline
│   ├── mock_gis.py              # Resilient fallback GIS dataset for reservoirs
│   ├── report_generator.py      # PDF & CSV export engine
│   ├── requirements.txt         # Python package dependencies
│   └── Dockerfile               # Backend container configuration
├── frontend/
│   ├── src/
│   │   ├── components/          # Map, Charts, Metric Cards, Simulation Sliders
│   │   ├── services/api.ts      # Client API service with dynamic baseURL
│   │   ├── types.ts             # TypeScript interface contracts
│   │   ├── App.tsx              # Main dashboard application shell
│   │   └── main.tsx             # React DOM root mounting
│   ├── package.json             # NPM dependencies & build scripts
│   ├── vercel.json              # Vercel routing & edge rewrites
│   ├── vite.config.ts           # Vite bundler & dev proxy configuration
│   └── Dockerfile               # Production Nginx frontend container
├── docker-compose.yml           # Multi-container orchestration
├── render.yaml                  # Infrastructure-as-code for Render deployment
└── README.md                    # Platform documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Python 3.11+**
- **Node.js 18+ & npm**
- *(Optional)* **Docker & Docker Compose**

### Option A: Manual Setup

#### 1. Backend (FastAPI)
```bash
# From the project root
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Start the server
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

#### 2. Frontend (React + Vite)
```bash
# In a new terminal tab:
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
Open your browser at `http://localhost:5173`

---

### Option B: Docker Compose (One Command)

To run the entire full-stack system inside containers:

```bash
docker-compose up --build
```
- **Frontend Dashboard:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000`

---

## 🌐 Deployment

### 1. Deploy Frontend to Vercel
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import your repo.
3. Configure the build:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Environment Variable:** `VITE_API_BASE_URL` = `https://<your-backend-url>/api`
4. Click **Deploy**.

### 2. Deploy Backend to Render
1. In the [Render Dashboard](https://render.com), click **New Web Service**.
2. Connect your repository and configure:
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
3. Click **Create Web Service**.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and GEE connection probe |
| `GET` | `/api/reservoirs` | Monitored drinking water reservoirs & coordinates |
| `GET` | `/api/reservoir/{id}` | Detailed geo-polygon bounds for a specific reservoir |
| `GET` | `/api/reservoir-health` | Current water quality indices, risk level, & mitigation checklist |
| `GET` | `/api/time-series` | Historical Sentinel-2 index progression (30/90/180/365 days) |
| `GET` | `/api/spectral-indices` | Current raw band values & biophysical indices |
| `GET` | `/api/export-report/pdf` | Generates official executive assessment report (PDF) |
| `GET` | `/api/export-report/csv` | Exports raw sensor readings (CSV) |

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!

Distributed under the **MIT License**. See `LICENSE` for more information.
