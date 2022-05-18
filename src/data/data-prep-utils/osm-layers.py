import pandas as pd
import geopandas as gpd
import pyrosm
import os


city_osm = {
    "Calgary": 3227127,
    "Edmonton": 2564500,
    "Halifax": 9344588,
    "Hamilton": 7034910,
    "Montreal": 8508277,
    "Ottawa": 4136816,
    "Toronto": 324211,
    "Vancouver": 1852574,
    "Victoria": 2221062,
    "Winnipeg": 1790696
}


def osm_parking(city):

    print("Creating parking layer for", city)

    gdf = gpd.read_file("../" + city + "/boundary.topojson")

    osm_id = city_osm[city]

    osm = pyrosm.OSM("../data-sources/osm-data/" + str(osm_id) + ".pbf")

    filter = {
        "amenity": ["parking"]
    }

    parking = osm.get_data_by_custom_criteria(custom_filter=filter, keep_nodes=False, keep_relations=True)

    parking = parking[(parking["parking"] != "underground")]
    parking = parking[(parking["parking"] != "multi-storey")]
    parking = parking[(parking["parking"] != "rooftop")]

    parking["T"] = "P"
    if city == "Toronto":
        parking["T"] = "P"
        parking.loc[parking.operator == "Toronto Parking Authority", 'T'] = "M"

    parking = parking.to_crs({'proj':'cea'})
    parking['area'] = parking.area
    parking = parking.to_crs({'init': 'epsg:4326'})

    parking = parking[(parking["area"] > 420)]

    parking = parking[["geometry","T"]]

    parking["geom_type"] = parking.geom_type
    parking = parking[parking["geom_type"].isin(["Polygon","MultiPolygon"])]
    del parking["geom_type"]

    # # works but is really slow
    parking = gpd.clip(parking,gdf)

    parking.to_file("../" + city + "/shift/lu_parking.geojson", driver='GeoJSON')

    os.system("geo2topo ../" + city + "/shift/lu_parking.geojson > ../" + city + "/shift/lu_parking.topojson -q 1e4")

    os.system("rm ../" + city + "/shift/lu_parking.geojson")





for city in ["Calgary", "Edmonton", "Halifax", "Hamilton", "Montreal", "Ottawa", "Toronto", "Vancouver", "Victoria", "Winnipeg"]:

    osm_parking(city)


