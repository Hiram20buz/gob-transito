import json
import re

with open('routes.json', 'r') as f:
    routes = json.load(f)

with open('src/constants/fastroute-mock.ts', 'r') as f:
    content = f.read()

def replacer(match):
    # match.group(0) is the entire match
    # we need to find which route it belongs to by looking slightly before it.
    return match.group(0) # placeholder

# We can split by 'coordinates: ['
parts = content.split('coordinates: [')

def format_coords(coords):
    return "[\n" + ",\n".join([f"      {{ latitude: {c['latitude']}, longitude: {c['longitude']} }}" for c in coords]) + "\n    ]"

new_content = parts[0]
new_content += "coordinates: " + format_coords(routes['r1']) + parts[1][parts[1].find(']'):].replace(']', '', 1)
new_content += "coordinates: " + format_coords(routes['r2']) + parts[2][parts[2].find(']'):].replace(']', '', 1)
new_content += "coordinates: " + format_coords(routes['r3']) + parts[3][parts[3].find(']'):].replace(']', '', 1)

with open('src/constants/fastroute-mock.ts', 'w') as f:
    f.write(new_content)

print("Mock file patched.")
