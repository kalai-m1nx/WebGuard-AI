class RiskScorer:
    @staticmethod
    def calculate_risk(scan_data: dict) -> tuple[int, str, dict, str, list]:
        indicators = scan_data.get("indicators", [])
        
        base_score = 10
        high_risk_count = 0
        warning_count = 0
        
        risk_breakdown = {
            "URL Signals": 10,
            "Page Signals": 10,
            "Network Signals": 10
        }

        for ind in indicators:
            if ind["status"] == "HIGH RISK":
                base_score += 30
                high_risk_count += 1
                if "URL" in ind["name"]: risk_breakdown["URL Signals"] += 30
                else: risk_breakdown["Page Signals"] += 30
            elif ind["status"] == "WARNING":
                base_score += 15
                warning_count += 1
                if "URL" in ind["name"]: risk_breakdown["URL Signals"] += 15
                else: risk_breakdown["Page Signals"] += 15

        if "error" in scan_data:
            base_score += 40 # Inaccessibility can be suspicious but might just be down
            risk_breakdown["Network Signals"] += 40

        # Cap score at 100
        score = min(100, base_score)
        
        if score < 30:
            level = "LOW RISK"
            summary = "The automated analysis did not find any significant malicious indicators. The website appears structurally normal, but always remain vigilant."
        elif score < 60:
            level = "MODERATE"
            summary = "Some unusual structural patterns or configuration issues were detected. Caution is advised before entering any sensitive information."
        elif score < 80:
            level = "SUSPICIOUS"
            summary = "The analysis identified several indicators that increase the website's risk score. These indicators do not definitively prove malicious activity, but high caution is recommended."
        else:
            level = "HIGH RISK"
            summary = "Critical security indicators triggered. The website exhibits characteristics strongly associated with phishing, malware distribution, or significant misconfiguration. Do not interact with this site."

        recommendations = [
            "Do not enter passwords or credentials.",
            "Do not provide banking or credit card information.",
            "Avoid downloading unknown files or extensions.",
            "Verify the domain name carefully for typos."
        ]

        return score, level, risk_breakdown, summary, recommendations
