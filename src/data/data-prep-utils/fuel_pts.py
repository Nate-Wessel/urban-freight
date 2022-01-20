import geopandas as gpd
import urllib.request
import os



# downloading the entire fuelling dataset

def dl_all_fuel():

    print("Downloading the electric charging and alternative fuelling station data")

    urlstring = "https://developer.nrel.gov/api/alt-fuel-stations/v1.geojson?fuel_type=all&country=CA&api_key=MVBU7hCe2w67hLeab4kYyZly0INT724iJ4syGsIM"

    urllib.request.urlretrieve(urlstring, filename="../data-sources/national-data/alt_fuel_stations.geojson")

    
    
# subsetting spatially and converting to topojson by city

def get_fuel(city):

    print("Getting fuelling / charging station data for", city)

    gdf = gpd.read_file("../" + city + "/boundary.topojson")
    poly = gdf["geometry"][0]

    gdffuel = gpd.read_file("../data-sources/national-data/alt_fuel_stations.geojson")

    gdffuel = gdffuel[gdffuel["status_code"] == "E"]

    gdffuel["type"] = gdffuel["fuel_type_code"]

    gdffuel.loc[gdffuel['ev_level1_evse_num'] >= 0, 'type'] = "E1"
    gdffuel.loc[gdffuel['ev_level2_evse_num'] >= 0, 'type'] = "E2"
    gdffuel.loc[gdffuel['ev_dc_fast_num'] >= 0, 'type'] = "E3"

    gdffuel = gdffuel[["type","geometry"]]

    gdffuel = gdffuel[gdffuel.within(poly)]

    gdffuel.to_file("../" + city + "/improve/alt_fuel_stations.geojson", driver='GeoJSON')

    os.system("geo2topo ../" + city + "/improve/alt_fuel_stations.geojson > ../" + city + "/improve/alt_fuel_stations.topojson -q 1e4")

    os.system("rm ../" + city + "/improve/alt_fuel_stations.geojson")




dl_all_fuel()

for city in ["Calgary", "Edmonton", "Halifax", "Hamilton", "Ottawa", "Toronto", "Vancouver", "Victoria", "Winnipeg"]:

    get_fuel(city)

