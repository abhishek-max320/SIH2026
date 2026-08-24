#include <iostream>
#include <cassert>
#include <cmath>
#include "../include/risk_engine.hpp"

int main() {
    std::cout << "========================================" << std::endl;
    std::cout << " AgriSentinel C++ Risk Engine Unit Tests" << std::endl;
    std::cout << "========================================" << std::endl;

    // Test 1: Haversine Distance (New Delhi to Agra ~180-200 km)
    // Delhi: 28.6139, 77.2090 | Agra: 27.1767, 78.0081
    double dist = AgriSentinel::RiskEngine::calculateHaversineDistance(28.6139, 77.2090, 27.1767, 78.0081);
    std::cout << "[TEST 1] Haversine Distance Delhi->Agra: " << dist << " km" << std::endl;
    assert(dist > 170.0 && dist < 210.0);
    std::cout << "  -> PASSED" << std::endl;

    // Test 2: Composite Risk Score
    // Disease Conf: 95%, Severity: 60%, Humidity: 85%, Temp Fav: 90%, Nearby: 8, Hist: 40%
    double risk = AgriSentinel::RiskEngine::computeCompositeRiskScore(95.0, 60.0, 85.0, 90.0, 8, 40.0);
    std::cout << "[TEST 2] Composite Risk Score: " << risk << " / 100" << std::endl;
    assert(risk >= 0.0 && risk <= 100.0);
    assert(risk > 70.0); // Should be high risk given high values
    std::cout << "  -> PASSED" << std::endl;

    // Test 3: Spatial Outbreak Clusters
    std::vector<AgriSentinel::OutbreakRecord> records = {
        {1, 28.6140, 77.2095, 75.0, 90.0, 1}, // ~0.05 km away
        {2, 28.6300, 77.2150, 60.0, 85.0, 2}, // ~2.0 km away
        {3, 28.6700, 77.2300, 80.0, 95.0, 3}, // ~6.5 km away
        {4, 28.7500, 77.3000, 50.0, 80.0, 4}  // ~17.0 km away
    };

    auto metrics = AgriSentinel::RiskEngine::analyzeClusters(28.6139, 77.2090, records.data(), records.size());
    std::cout << "[TEST 3] Clusters: 1km=" << metrics.countWithin1km 
              << ", 5km=" << metrics.countWithin5km 
              << ", 10km=" << metrics.countWithin10km 
              << ", 25km=" << metrics.countWithin25km 
              << ", Nearest=" << metrics.nearestDistanceKm << " km"
              << ", ProximityScore=" << metrics.weightedProximityScore << std::endl;
    assert(metrics.countWithin1km == 1);
    assert(metrics.countWithin5km == 2);
    assert(metrics.countWithin10km == 3);
    assert(metrics.countWithin25km == 4);
    assert(metrics.nearestDistanceKm < 0.1);
    std::cout << "  -> PASSED" << std::endl;

    std::cout << "\n>>> ALL C++ RISK ENGINE TESTS PASSED SUCCESSFULLY! <<<\n" << std::endl;
    return 0;
}
