#include "../include/risk_engine.hpp"
#include <cmath>
#include <algorithm>
#include <cfloat>

namespace AgriSentinel {

constexpr double EARTH_RADIUS_KM = 6371.0;
constexpr double PI = 3.14159265358979323846;

static inline double degToRad(double deg) {
    return deg * (PI / 180.0);
}

double RiskEngine::calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
    double dLat = degToRad(lat2 - lat1);
    double dLon = degToRad(lon2 - lon1);

    double rLat1 = degToRad(lat1);
    double rLat2 = degToRad(lat2);

    double a = std::sin(dLat / 2.0) * std::sin(dLat / 2.0) +
               std::cos(rLat1) * std::cos(rLat2) *
               std::sin(dLon / 2.0) * std::sin(dLon / 2.0);

    double c = 2.0 * std::atan2(std::sqrt(a), std::sqrt(1.0 - a));
    return EARTH_RADIUS_KM * c;
}

double RiskEngine::computeCompositeRiskScore(
    double diseaseConfidence,
    double severityPercent,
    double humidity,
    double tempFavorability,
    int nearbyCases10km,
    double historicalRiskFactor
) {
    // Weighted multi-variate risk formula
    // Weights:
    // - Disease Confidence: 25%
    // - Severity: 25%
    // - Weather Disease Favorability: 25% (60% humidity weight + 40% temp weight)
    // - Proximity Clustering: 15%
    // - Historical Regional Risk: 10%

    double confidenceComponent = (diseaseConfidence / 100.0) * 25.0;
    double severityComponent   = (severityPercent / 100.0) * 25.0;
    
    double weatherComponent    = ((humidity / 100.0 * 0.6) + (tempFavorability / 100.0 * 0.4)) * 25.0;
    
    // Proximity factor saturated at 10 cases within 10 km
    double clusterRatio        = std::min(1.0, nearbyCases10km / 10.0);
    double proximityComponent  = clusterRatio * 15.0;

    double historyComponent    = (historicalRiskFactor / 100.0) * 10.0;

    double totalScore = confidenceComponent + severityComponent + weatherComponent + proximityComponent + historyComponent;
    return std::max(0.0, std::min(100.0, totalScore));
}

OutbreakClusterMetrics RiskEngine::analyzeClusters(
    double targetLat,
    double targetLon,
    const OutbreakRecord* records,
    int recordCount
) {
    OutbreakClusterMetrics metrics = {0, 0, 0, 0, 99999.0, 0.0};

    if (recordCount <= 0 || records == nullptr) {
        return metrics;
    }

    double minDistance = 99999.0;
    double weightedProximitySum = 0.0;

    for (int i = 0; i < recordCount; ++i) {
        double dist = calculateHaversineDistance(targetLat, targetLon, records[i].latitude, records[i].longitude);
        if (dist < minDistance) {
            minDistance = dist;
        }

        double sevWeight = records[i].severity / 100.0;
        double confWeight = records[i].confidence / 100.0;

        if (dist <= 1.0) {
            metrics.countWithin1km++;
            metrics.countWithin5km++;
            metrics.countWithin10km++;
            metrics.countWithin25km++;
            weightedProximitySum += 25.0 * sevWeight * confWeight;
        } else if (dist <= 5.0) {
            metrics.countWithin5km++;
            metrics.countWithin10km++;
            metrics.countWithin25km++;
            weightedProximitySum += 15.0 * (1.0 - (dist - 1.0)/4.0) * sevWeight * confWeight;
        } else if (dist <= 10.0) {
            metrics.countWithin10km++;
            metrics.countWithin25km++;
            weightedProximitySum += 8.0 * (1.0 - (dist - 5.0)/5.0) * sevWeight * confWeight;
        } else if (dist <= 25.0) {
            metrics.countWithin25km++;
            weightedProximitySum += 3.0 * (1.0 - (dist - 10.0)/15.0) * sevWeight * confWeight;
        }
    }

    metrics.nearestDistanceKm = minDistance;
    metrics.weightedProximityScore = std::min(100.0, weightedProximitySum);
    return metrics;
}

} // namespace AgriSentinel

// C-compatible exports
extern "C" {
    AGRI_API double cpp_haversine_distance(double lat1, double lon1, double lat2, double lon2) {
        return AgriSentinel::RiskEngine::calculateHaversineDistance(lat1, lon1, lat2, lon2);
    }

    AGRI_API double cpp_compute_risk_score(
        double diseaseConfidence,
        double severityPercent,
        double humidity,
        double tempFavorability,
        int nearbyCases10km,
        double historicalRiskFactor
    ) {
        return AgriSentinel::RiskEngine::computeCompositeRiskScore(
            diseaseConfidence,
            severityPercent,
            humidity,
            tempFavorability,
            nearbyCases10km,
            historicalRiskFactor
        );
    }

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
    ) {
        int c1 = 0, c5 = 0, c10 = 0, c25 = 0;
        double minD = 99999.0;
        double proxScoreSum = 0.0;

        for (int i = 0; i < recordCount; ++i) {
            double dist = AgriSentinel::RiskEngine::calculateHaversineDistance(
                targetLat, targetLon, recordLats[i], recordLons[i]
            );
            if (dist < minD) {
                minD = dist;
            }
            double sev = recordSeverities[i] / 100.0;

            if (dist <= 1.0) {
                c1++; c5++; c10++; c25++;
                proxScoreSum += 25.0 * sev;
            } else if (dist <= 5.0) {
                c5++; c10++; c25++;
                proxScoreSum += 15.0 * (1.0 - (dist - 1.0)/4.0) * sev;
            } else if (dist <= 10.0) {
                c10++; c25++;
                proxScoreSum += 8.0 * (1.0 - (dist - 5.0)/5.0) * sev;
            } else if (dist <= 25.0) {
                c25++;
                proxScoreSum += 3.0 * (1.0 - (dist - 10.0)/15.0) * sev;
            }
        }

        if (out1km) *out1km = c1;
        if (out5km) *out5km = c5;
        if (out10km) *out10km = c10;
        if (out25km) *out25km = c25;
        if (outNearestDistKm) *outNearestDistKm = (recordCount > 0) ? minD : 0.0;
        if (outProximityScore) *outProximityScore = std::min(100.0, proxScoreSum);
    }
}
