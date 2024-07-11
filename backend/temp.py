import requests


def get_locations(url):
    response = requests.get(url)
    if response.status_code == 200:
        try:
            data = response.json()
            locations = data.get("list", [])
            if locations:
                return locations
            else:
                return "The list of locations is empty."
        except ValueError:
            return "Failed to parse JSON response."
    else:
        return f"Failed to fetch data, status code: {response.status_code}"

def search_id(location_name, url):
    location_list = get_locations(url)
    if isinstance(location_list, list):
        for location in location_list:
            if location.get("display_name") == location_name:
                return location.get("id")
        return f"No location found with the name {location_name}."
    else:
        return location_list
url = "https://api.stage.cogoport.io/list_locations"

# Example usage
origin =  "Humpfershausen, Thuringen, Germany"
location_id = search_id(origin, url)
print(location_id)
