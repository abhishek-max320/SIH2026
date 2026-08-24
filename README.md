# AgriSentinel AI: AI-Powered Crop Health Intelligence & Early Warning Platform

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026_Prototype-FF6B00.svg?style=for-the-badge)](https://sih.gov.in)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![C++17](https://img.shields.io/badge/C++-17_Native_Engine-00599C.svg?style=for-the-badge&logo=c%2B%2B)](https://isocpp.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Visuals-black.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)

---

## 🌾 1. Problem Statement & Motivation
**Problem Statement**: *Early Detection and Management of Crop Diseases and Pest Infestations.*

Standard agricultural apps act as simple single-leaf image classifiers without epidemiological context. AgriSentinel AI transforms this into an **AI-Powered Crop Health Intelligence & Early Warning Network**:

$$\text{Detect} \longrightarrow \text{Analyze} \longrightarrow \text{Estimate Severity} \longrightarrow \text{Predict Risk} \longrightarrow \text{Recommend Management} \longrightarrow \text{Warn Nearby Farmers} \longrightarrow \text{Monitor Recovery} \longrightarrow \text{Government Surveillance}$$

---

## 🏛️ 2. System Architecture

```text
                    [ FARMERS / OFFICERS / EXPERTS ]
                                   │
                                   ▼
          ┌─────────────────────────────────────────────────┐
          │         Next.js 15 App Router Frontend          │
          │  - Dark Futuristic UI (#050505 & #FF6B00)       │
          │  - Three.js / React Three Fiber 3D Globe        │
          │  - Framer Motion Micro-Animations               │
          │  - Leaflet Geospatial Radar & Heatmap           │
          │  - Recharts State Surveillance Analytics        │
          └────────────────────────┬────────────────────────┘
                                   │ REST / WebSocket (/api/v1)
                                   ▼
          ┌─────────────────────────────────────────────────┐
          │             FastAPI Python Backend              │
          │  - Pydantic v2 Contract Validation              │
          │  - Multi-Role JWT Auth (RBAC)                   │
          │  - OpenCV Laplacian Image Quality Control (QC)  │
          │  - Deep CNN Pathogen Classifier + Grad-CAM      │
          │  - YOLOv8 Pest Object Bounding Box Detector     │
          │  - Colorimetric Area Severity Segmenter         │
          └────────┬─────────────────┬─────────────────┬────┘
                   │                 │                 │
     ┌─────────────┘                 │                 └─────────────┐
     ▼                               ▼                               ▼
┌──────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│  Weather Service │    │ High-Performance C++17 │    │ Verified ICAR Protocol │
│  - Open-Meteo    │    │      Risk Engine       │    │ - Cultural Management  │
│  - Microclimate  │    │  - Haversine Distance  │    │ - Biological Control   │
│  - Disease Index │    │  - 1-25km Ring Clusters│    │ - Chemical Protocols   │
│    Calculation   │    │  - Multi-Variate Score │    │ - Safety Intervals     │
└────────┬─────────┘    └────────────┬───────────┘    └──────────┬─────────────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     ▼
          ┌─────────────────────────────────────────────────┐
          │      Geo-Targeted Early Warning Network         │
          │  - Radius Dispatcher (Farms within 5-25 km)     │
          │  - Human-in-the-Loop Expert Verification        │
          │  - Automated Regional Epidemiological Updates   │
          └──────────────────────────┬──────────────────────┘
                                     │
                                     ▼
          ┌─────────────────────────────────────────────────┐
          │         PostgreSQL + PostGIS Database           │
          │  - Spatial Geometry Indexing                    │
          │  - Historical Outbreak Tracking                 │
          └─────────────────────────────────────────────────┘
```

---

## ⚡ 3. Technology Stack & Architectural Roles

| Technology | Role & Responsibility | Rationale |
|---|---|---|
| **Next.js 15 (JSX / JS)** | Full-Stack Frontend Portal | Instant SSR/Client rendering, dark glassmorphism theme, modular components. |
| **Three.js & R3F** | 3D Interactive Crop Scene | Real-time rotating digital globe with glowing laser scan rings and particle nodes. |
| **Framer Motion** | Micro-Animations & Telemetry | Smooth card reveals, laser scan line motion, gauge fill animations. |
| **FastAPI (Python)** | High-throughput Async REST API | OpenAPI docs, Pydantic v2 schemas, multi-tier service orchestration. |
| **C++17 Engine** | High-Performance Spatial Engine | Compiled native binary (`-O3`) executing sub-millisecond Haversine distance and multi-ring cluster queries without Python runtime overhead. |
| **OpenCV** | Image Quality Control (QC) | Evaluates Laplacian discrete convolution variance (blur), mean intensity (lighting), and canopy pixel ratio. |
| **PyTorch & YOLO** | Dual AI Vision Inference | CNN pathogen lesion classification + YOLO pest bounding box localization + Grad-CAM explainability. |
| **PostgreSQL + PostGIS** | Geospatial & Relational Storage | Fast spatial queries, anonymous coordinate fuzzing for farmer privacy. |
| **Leaflet & Recharts** | Geospatial Maps & Analytics | Interactive regional disease heatmap and district trend charts. |

---

## 🚀 4. Quick Start & Local Setup

### Prerequisites
* **Python 3.12+**
* **Node.js v20+** and **npm**
* **MinGW g++ (C++17)**

### Step 1: Clone and Navigate
```powershell
cd crop-health-ai
```

### Step 2: Build the C++ Engine
```powershell
cd cpp-engine
powershell -ExecutionPolicy Bypass -File build.ps1
cd ..
```
*Compiles `bin/risk_engine_cli.exe` and `bin/risk_engine.dll` and verifies all unit tests.*

### Step 3: Start the FastAPI Backend
```powershell
cd backend
pip install -r requirements.txt email-validator
python -c "from app.db.seed_data import seed_database; seed_database()"
python main.py
```
*Backend runs on `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.*

### Step 4: Start the Next.js Frontend
```powershell
cd ../frontend
npm install --legacy-peer-deps
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🌟 5. SIH 2026 1-Click Judging Demonstration

To experience the full end-to-end intelligence cycle in 60 seconds:
1. Open **`http://localhost:3000/login`**
2. Click on any **1-Click Persona** (e.g. `🌾 Farmer Persona`).
3. Click **"Scan Crop"** in the top navigation.
4. Click on **"🌾 Infected Wheat Leaf (Leaf Rust)"** from the *SIH 1-Click Test Specimens* panel.
5. Click **"ANALYZE CROP SPECIMEN"**.
6. Observe:
   - Automated OpenCV QC check passing.
   - Dual AI inference identifying *Wheat Leaf Rust (94.7% confidence)* and *Aphid pest count*.
   - Grad-CAM neural heatmap highlighting lesion clusters.
   - Real-time weather favorability calculation.
   - Native C++ engine computing *82/100 HIGH RISK* based on 4 nearby cases in Ludhiana.
   - ICAR-verified step-by-step Triazole treatment protocol.
   - Early warning notification automatically dispatched to susceptible farms within 25 km.
   - Government Heatmap (**`/map`**) and State Surveillance Desk (**`/government`**) updating live!

---

## 👥 6. Multi-Role User Personas

| Role | Default Credentials | Capabilities |
|---|---|---|
| **🌾 Farmer** | `farmer@agrisentinel.ai` / `farmer123` | Farm crop monitoring, 3D leaf scanning, health score, localized weather risk, nearby outbreak warnings. |
| **🔬 Agronomist Expert** | `expert@agrisentinel.ai` / `expert123` | Human-in-the-loop portal reviewing low-confidence scans (<70%), confirming/correcting diagnoses, updating continuous learning registry. |
| **🏛️ State Agriculture Officer** | `officer@agrisentinel.ai` / `officer123` | Interactive PostGIS disease heatmap, district vulnerability ranking, epidemic weekly progression curves. |
| **⚡ System Admin** | `admin@agrisentinel.ai` / `admin123` | C++ spatial engine latency monitors, neural weights registry, database spatial indexing telemetry. |

---

## 🔐 7. Security & Privacy Highlights
* **Geospatial Fuzzing**: Exact farmer GPS coordinates are never publicly exposed; surveillance heatmaps aggregate data into anonymized district centroids.
* **Direct Bcrypt Hashing**: 72-byte safe password hashing with SHA-256 JWT authorization tokens.
* **Verified Chemical Protocols**: Chemical recommendations strictly require registered active ingredients (CIB&RC / ICAR) with mandatory safety intervals to prevent pesticide misuse.

---

## 📜 8. License
Developed for the **Smart India Hackathon 2026 (SIH 2026)**. Open Source under the MIT License.
