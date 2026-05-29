import urllib.request
import json

def get_route(lon1, lat1, lon2, lat2):
    url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        coords = data['routes'][0]['geometry']['coordinates']
        # GeoJSON is [lon, lat], we need {latitude, longitude}
        return [{"latitude": round(lat, 5), "longitude": round(lon, 5)} for lon, lat in coords]

# Route 1: Macroplaza (32.497, -116.940) to Zona Río (32.528, -117.012)
r1 = get_route(-116.940, 32.497, -117.012, 32.528)
# Route 2: 5 y 10 (32.496, -116.960) to Centro (32.532, -117.038)
r2 = get_route(-116.960, 32.496, -117.038, 32.532)
# Route 3: Otay (32.534, -116.936) to Estadio Caliente (32.505, -116.992)
r3 = get_route(-116.936, 32.534, -116.992, 32.505)

with open('routes.json', 'w') as f:
    json.dump({'r1': r1, 'r2': r2, 'r3': r3}, f)

print("Routes generated.")
