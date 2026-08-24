#ifndef RISK_ENGINE_HPP
#define RISK_ENGINE_HPP

#include <vector>
#include <string>

#ifdef _WIN32
  #define AGRI_API __declspec(dllexport)
#else
  #define AGRI_API __attribute__((visibility("default")))
#endif

namespace AgriSentinel {

struct GeoCoordinate {
    double latitude;
    double longitude;
};

struct OutbreakRecord {
    int id;
    double latitude;
    double longitude;
    double severity;        // 0.0 to 100.0
    double confidence;      // 0.0 to 100.0
    int daysAgo;
};

struct OutbreakClusterMetrics {
    int countWithin1km;
    int countWithin5km;
    int countWithin10km;
    int countWithin25km;
    double nearestDistanceKm;
    double weightedProximityScore; // 0.0 to 100.0
};

class RiskEngine {
public:
    // Fast Haversine Distance in Kilometers
    static double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2);

    // Multi-variate dynamic composite risk score (0 - 100)
    static double computeCompositeRiskScore(
        double diseaseConfidence,
        double severityPercent,
        double humidity,
        double tempFavorability,
        int nearbyCases10km,
        double historicalRiskFactor
    );

    // Multi-ring spatial cluster aggregation
    static OutbreakClusterMetrics analyzeClusters(
        double targetLat,
        double targetLon,
        const OutbreakRecord* records,
        int recordCount
    );
};

} // namespace AgriSentinel

// C-compatible ABI exports for Python ctypes integration
extern "C" {
    AGRI_API double cpp_haversine_distance(double lat1, double lon1, double lat2, double lon2);

    AGRI_API double cpp_compute_risk_score(
        double diseaseConfidence,
        double severityPercent,
        double humidity,
        double tempFavorability,
        int nearbyCases10km,
        double historicalRiskFactor
    );

    AGRI_API void cpp_analyze_outbreak_clusters(
        double targetLat,
        double targetLon,
        const double* recordLats,
        const double* recordLons,
        const double* recordSeverities,
        int recordCount,
        int* out1km,
        int* out5km,
        int* out10km,
        int* out25km,
        double* outNearestDistKm,
        double* outProximityScore
    );
}

#endif // RISK_ENGINE_HPP
