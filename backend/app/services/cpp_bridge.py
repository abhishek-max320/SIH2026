"""
AgriSentinel AI - C++ High-Performance Engine Python Bridge
Provides sub-millisecond Haversine distance, cluster aggregation, and multi-variate risk scoring.
Supports direct DLL ctypes binding with seamless native CLI subprocess acceleration for cross-bitness support.
"""
import ctypes
import os
import subprocess
import json
from typing import List, Dict, Any

class CppRiskEngineBridge:
    _instance = None
    _lib = None
    _cli_path = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CppRiskEngineBridge, cls).__new__(cls)
            cls._instance._load_engine()
        return cls._instance

    def _load_engine(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        dll_candidates = [
            os.path.abspath(os.path.join(base_dir, "../../../cpp-engine/bin/risk_engine.dll")),
            os.path.abspath(os.path.join(base_dir, "../../cpp-engine/bin/risk_engine.dll")),
        ]
        cli_candidates = [
            os.path.abspath(os.path.join(base_dir, "../../../cpp-engine/bin/risk_engine_cli.exe")),
            os.path.abspath(os.path.join(base_dir, "../../cpp-engine/bin/risk_engine_cli.exe")),
        ]

        # 1. Try direct DLL loading
        for p in dll_candidates:
            if os.path.exists(p):
                try:
                    self._lib = ctypes.CDLL(p)
                    self._lib.cpp_haversine_distance.argtypes = [
                        ctypes.c_double, ctypes.c_double, ctypes.c_double, ctypes.c_double
                    ]
                    self._lib.cpp_haversine_distance.restype = ctypes.c_double
                    self._lib.cpp_compute_risk_score.argtypes = [
                        ctypes.c_double, ctypes.c_double, ctypes.c_double, ctypes.c_double,
                        ctypes.c_int, ctypes.c_double
                    ]
                    self._lib.cpp_compute_risk_score.restype = ctypes.c_double
                    print(f"[SUCCESS] Native C++ Risk Engine loaded via direct DLL: {p}")
                    return
                except Exception:
                    self._lib = None

        # 2. Check for native compiled CLI executable
        for p in cli_candidates:
            if os.path.exists(p):
                self._cli_path = p
                print(f"[SUCCESS] Native C++ Risk Engine loaded via native binary: {p}")
                return

        print("[INFO] Using optimized in-memory Python risk algorithms.")

    def haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate geographical distance in kilometers via native C++ engine."""
        if self._lib:
            try:
                return float(self._lib.cpp_haversine_distance(lat1, lon1, lat2, lon2))
            except Exception:
                pass

        if self._cli_path:
            try:
                res = subprocess.run(
                    [self._cli_path, "distance", str(lat1), str(lon1), str(lat2), str(lon2)],
                    capture_output=True, text=True, check=True, timeout=2
                )
                data = json.loads(res.stdout.strip())
                return float(data.get("distance_km", 0.0))
            except Exception:
                pass

        # Optimized fallback formula
        import math
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2.0) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * (math.sin(dlon / 2.0) ** 2))
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return R * c

    def compute_risk_score(
        self,
        disease_confidence: float,
        severity_percent: float,
        humidity: float,
        temp_favorability: float,
        nearby_cases_10km: int,
        historical_risk_factor: float = 20.0
    ) -> float:
        """Compute multivariate 0-100 outbreak risk score via native C++ engine."""
        if self._lib:
            try:
                return float(self._lib.cpp_compute_risk_score(
                    disease_confidence, severity_percent, humidity, temp_favorability,
                    nearby_cases_10km, historical_risk_factor
                ))
            except Exception:
                pass

        if self._cli_path:
            try:
                res = subprocess.run(
                    [
                        self._cli_path, "risk",
                        str(disease_confidence), str(severity_percent),
                        str(humidity), str(temp_favorability),
                        str(nearby_cases_10km), str(historical_risk_factor)
                    ],
                    capture_output=True, text=True, check=True, timeout=2
                )
                data = json.loads(res.stdout.strip())
                return float(data.get("risk_score", 0.0))
            except Exception:
                pass

        # Formula
        conf_c = (disease_confidence / 100.0) * 25.0
        sev_c = (severity_percent / 100.0) * 25.0
        weather_c = ((humidity / 100.0 * 0.6) + (temp_favorability / 100.0 * 0.4)) * 25.0
        cluster_factor = min(1.0, nearby_cases_10km / 10.0)
        prox_c = cluster_factor * 15.0
        hist_c = (historical_risk_factor / 100.0) * 10.0
        return round(max(0.0, min(100.0, conf_c + sev_c + weather_c + prox_c + hist_c)), 2)

    def analyze_clusters(
        self,
        target_lat: float,
        target_lon: float,
        records: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Aggregate surrounding outbreaks within 1km, 5km, 10km, 25km rings using C++ distance calculation."""
        if not records:
            return {
                "count_1km": 0,
                "count_5km": 0,
                "count_10km": 0,
                "count_25km": 0,
                "nearest_distance_km": 0.0,
                "proximity_score": 0.0
            }

        c1, c5, c10, c25 = 0, 0, 0, 0
        min_d = 99999.0
        prox_sum = 0.0

        for r in records:
            d = self.haversine_distance(target_lat, target_lon, r["latitude"], r["longitude"])
            if d < min_d:
                min_d = d
            sev = r.get("severity", 50.0) / 100.0
            if d <= 1.0:
                c1 += 1; c5 += 1; c10 += 1; c25 += 1
                prox_sum += 25.0 * sev
            elif d <= 5.0:
                c5 += 1; c10 += 1; c25 += 1
                prox_sum += 15.0 * (1.0 - (d - 1.0)/4.0) * sev
            elif d <= 10.0:
                c10 += 1; c25 += 1
                prox_sum += 8.0 * (1.0 - (d - 5.0)/5.0) * sev
            elif d <= 25.0:
                c25 += 1
                prox_sum += 3.0 * (1.0 - (d - 10.0)/15.0) * sev

        return {
            "count_1km": c1,
            "count_5km": c5,
            "count_10km": c10,
            "count_25km": c25,
            "nearest_distance_km": round(min_d if records else 0.0, 2),
            "proximity_score": round(min(100.0, prox_sum), 2)
        }

# Global singleton
cpp_engine = CppRiskEngineBridge()
