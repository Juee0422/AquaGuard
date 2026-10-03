# AquaGuard AI: Satellite-Based Harmful Algal Bloom (HAB) & Water Quality Early Warning System

AquaGuard AI is an end-to-end, production-grade web platform combining ESA Copernicus Sentinel-2 multi-spectral remote sensing, automated cloud computing, and interactive GIS mapping to detect **Chlorophyll-a**, **Floating Algae Index (FAI)**, **Turbidity (NDTI)**, and **Water Clarity** across municipal drinking water reservoirs (e.g., Tansa Reservoir, Bhatsa Lake, Middle/Upper Vaitarna, Tulsi Lake, Powai Lake).

Built to protect public health and drinking water supplies for municipal water treatment complexes (such as the Brihanmumbai Municipal Corporation / BMC Bhandup and Panjrapur treatment works).

---

## 🛰️ Multi-Spectral Remote Sensing Physics & Band Math

AquaGuard AI ingests surface reflectance data from Sentinel-2 MSI (`COPERNICUS/S2_SR_HARMONIZED`) and calculates the following bio-optical indices:

1. **Normalized Difference Water Index (NDWI)**:
   $$\text{NDWI} = \frac{\text{B3} - \text{B8}}{\text{B3} + \text{B8}}$$
   * *Threshold > 0.10* delineates open water bodies from surrounding terrain.
2. **Floating Algae Index (FAI)**:
   $$\text{FAI} = \text{B8} - \left[ \text{B4} + (\text{B11} - \text{B4}) \times \frac{842 - 665}{1610 - 665} \right]$$
   * Isolates NIR reflectance peak of floating algal mats against the Red-to-SWIR baseline, eliminating thin cloud and sun-glint interference.
3. **Normalized Difference Vegetation Index (NDVI)**:
   $$\text{NDVI} = \frac{\text{B8} - \text{B4}}{\text{B8} + \text{B4}}$$
   * Measures surface macrophyte and dense vegetative mat density.
4. **Normalized Difference Turbidity Index (NDTI)**:
   $$\text{NDTI} = \frac{\text{B4} - \text{B3}}{\text{B4} + \text{B3}}$$
   * Proxy for suspended sediment and post-monsoon silt runoff.

---

## ⚡ Key Platform Features & UX Innovations

- **Obsidian & Emerald Water Aesthetic**: Executive dark-mode dashboard with soft ambient lighting shadows, glassmorphic cards, and micro-interactions.
- **Interactive GIS Mapping**: React-Leaflet GIS viewer with reservoir polygon overlays, sub-basin risk zones (Safe green, Moderate amber, Critical red), custom popups, and basemap switcher (Obsidian GIS, Copernicus Satellite, Topo).
- **Multi-Temporal Area & Threshold Charts**: 5-day Sentinel-2 revisit progression across 30, 90, 180, and 365 days with WHO potable limit reference lines.
- **Live Threat Alert Status**: Dynamic threat classification (Safe, Moderate, Critical) with composite HAB risk score (0-100) and primary ecological driver tracking.
- **Water Treatment Mitigation Strategy Engine**: Actionable operational checklists for plant operators (e.g. lowering raw intake sluice gates below the photic zone, PAC dosage for MIB/Geosmin odor removal, ultrasonic algae buoys).
- **What-If Environmental Stress Test Simulator**: Evaluators can adjust nutrient runoff multipliers (0.5x - 3.5x), heatwave temperature anomalies (-2°C to +7°C), runoff days, and sunlight hours to observe real-time algal bloom responses.
- **Executive PDF & CSV Report Generator**: One-click download of formal assessment reports generated with ReportLab and raw CSV data tables.
- **Resilient Fallback Mode**: If Google Earth Engine credentials are not present during local/CI runs, the platform automatically switches to a high-fidelity synthetic GIS engine with zero downtime.

---

## 🏗️ Architecture & Tech Stack

- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2, Shapely, ReportLab, Google Earth Engine Python API (`earthengine-api`).
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet / React-Leaflet, Recharts, Framer Motion.
- **DevOps / Containers**: Docker, Docker Compose, Nginx, Render / Vercel configurations.

---

## 🚀 Quickstart & Local Setup

### 1. Backend Setup
```bash
# From the root directory
source venv/bin/activate  # or python3 -m venv venv && source venv/bin/activate
pip install -r backend/requirements.txt

# Run the FastAPI server
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API documentation is available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🐳 Docker Compose (One-Command Deployment)

Run both the FastAPI backend and Nginx-proxied React frontend together:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## 🌍 Google Earth Engine (GEE) Authentication (Optional)

AquaGuard AI works out of the box with realistic synthetic GIS modeling. To connect to live Copernicus Sentinel-2 satellite feeds:
1. Register a Google Cloud project with Earth Engine enabled at [earthengine.google.com](https://earthengine.google.com).
2. Run the authentication command:
   ```bash
   earthengine authenticate
   ```
3. Set your project environment variable:
   ```bash
   export EARTHENGINE_PROJECT="your-project-id"
   ```

---

## 📄 License
AquaGuard AI is released under the MIT Open Source License.
