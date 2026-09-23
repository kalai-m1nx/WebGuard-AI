import urllib.parse
import httpx
from bs4 import BeautifulSoup
import re

class PassiveScanner:
    @staticmethod
    async def analyze_url(url: str) -> dict:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc
        
        # URL Heuristics
        url_length = len(url)
        special_chars = len(re.findall(r'[^a-zA-Z0-9\-\.\/\:]', url))
        is_ip = bool(re.match(r'^(\d{1,3}\.){3}\d{1,3}$', domain))
        
        url_indicator = {
            "name": "URL Structure",
            "status": "PASS",
            "reason": "URL appears normal."
        }
        
        if is_ip:
            url_indicator = {"name": "URL Structure", "status": "HIGH RISK", "reason": "URL uses an IP address instead of a domain name."}
        elif url_length > 100 or special_chars > 15:
            url_indicator = {"name": "URL Structure", "status": "WARNING", "reason": "URL is unusually long or contains many special characters."}

        # Fetch page for metadata
        https_indicator = {"name": "HTTPS/Security", "status": "PASS", "reason": "Connection is secure."}
        if not url.startswith("https"):
            https_indicator = {"name": "HTTPS/Security", "status": "WARNING", "reason": "Website is not using HTTPS."}

        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(url)
                
            redirect_count = len(response.history)
            redirect_indicator = {"name": "Redirect Behavior", "status": "PASS", "reason": f"{redirect_count} redirects detected."}
            if redirect_count > 3:
                redirect_indicator = {"name": "Redirect Behavior", "status": "WARNING", "reason": f"Excessive redirects ({redirect_count}) detected."}
            
            soup = BeautifulSoup(response.text, 'html.parser')
            forms = soup.find_all('form')
            scripts = soup.find_all('script')
            
            form_indicator = {"name": "Form Analysis", "status": "PASS", "reason": f"{len(forms)} forms found."}
            if len(forms) > 0 and not url.startswith("https"):
                form_indicator = {"name": "Form Analysis", "status": "HIGH RISK", "reason": "Forms present on an insecure (HTTP) connection."}
            
            # Count external scripts
            external_scripts = [s for s in scripts if s.get('src') and not s.get('src').startswith('/') and domain not in s.get('src')]
            script_indicator = {"name": "JavaScript Analysis", "status": "PASS", "reason": f"{len(scripts)} scripts found."}
            if len(external_scripts) > len(scripts) / 2 and len(scripts) > 0:
                script_indicator = {"name": "JavaScript Analysis", "status": "WARNING", "reason": "High ratio of external third-party scripts."}
                
        except Exception as e:
             return {
                 "domain": domain,
                 "indicators": [url_indicator, https_indicator],
                 "error": str(e)
             }

        return {
            "domain": domain,
            "indicators": [url_indicator, https_indicator, redirect_indicator, form_indicator, script_indicator]
        }
