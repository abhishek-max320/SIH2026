#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include "../include/risk_engine.hpp"

// High-performance CLI interface for C++ Spatial & Risk Engine
// Supports batch processing via standard IO / CLI arguments
int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "{\"error\":\"Usage: risk_engine_cli <command> [args...]\"}" << std::endl;
        return 1;
    }

    std::string command = argv[1];

    if (command == "distance" && argc >= 6) {
        double lat1 = std::stod(argv[2]);
        double lon1 = std::stod(argv[3]);
        double lat2 = std::stod(argv[4]);
        double lon2 = std::stod(argv[5]);
        double dist = AgriSentinel::RiskEngine::calculateHaversineDistance(lat1, lon1, lat2, lon2);
        std::cout << "{\"distance_km\":" << dist << "}" << std::endl;
        return 0;
    }

    if (command == "risk" && argc >= 8) {
        double diseaseConf = std::stod(argv[2]);
        double severity = std::stod(argv[3]);
        double humidity = std::stod(argv[4]);
        double tempFav = std::stod(argv[5]);
        int nearbyCases = std::stoi(argv[6]);
        double histRisk = std::stod(argv[7]);

        double score = AgriSentinel::RiskEngine::computeCompositeRiskScore(
            diseaseConf, severity, humidity, tempFav, nearbyCases, histRisk
        );

        std::string riskLevel = "LOW";
        if (score >= 75.0) riskLevel = "CRITICAL";
        else if (score >= 50.0) riskLevel = "HIGH";
        else if (score >= 25.0) riskLevel = "MODERATE";

        std::cout << "{\"risk_score\":" << score 
                  << ",\"risk_level\":\"" << riskLevel << "\"}" << std::endl;
        return 0;
    }

    std::cout << "{\"error\":\"Unknown command or invalid arguments\"}" << std::endl;
    return 1;
}
