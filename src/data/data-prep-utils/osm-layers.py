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



def osm_cycling(city):

    print("Creating cycling layer for", city)

    gdf = gpd.read_file("../" + city + "/boundary.topojson")

    osm_id = city_osm[city]

    osm = pyrosm.OSM("../data-sources/osm-data/" + str(osm_id) + ".pbf")

    filter = {
        "cycleway": ["crossing","lane","opposite_lane","share_busway","shared_lane","shoulder","track","yes"],
        "cycleway:left": ["crossing","lane","opposite_lane","share_busway","shared_lane","shoulder","track","yes"],
        "cycleway:right": ["crossing","lane","opposite_lane","share_busway","shared_lane","shoulder","track","yes"],
        "cycleway:both": ["crossing","lane","opposite_lane","share_busway","shared_lane","shoulder","track","yes"],
        "bicycle": ["designated"],
        "highway": ["cycleway"]
    }

    edges = osm.get_data_by_custom_criteria(custom_filter=filter, keep_nodes=False, keep_ways=True, keep_relations=True)

    # sharrow = S
    # lane = L
    # track = T
    # separtaed path = P
    # other/NA = O

    edges["type"] = "O"

    edges.loc[edges.cycleway == "shoulder", 'type'] = "S"
    edges.loc[edges.cycleway == "shared_lane", 'type'] = "S"
    edges.loc[edges.cycleway == "share_busway", 'type'] = "S"
    try:
        edges.loc[edges["cycleway:left"] == "shoulder", 'type'] = "S"
        edges.loc[edges["cycleway:left"] == "shared_lane", 'type'] = "S"
        edges.loc[edges["cycleway:left"] == "share_busway", 'type'] = "S"
    except:
        None
    try:
        edges.loc[edges["cycleway:right"] == "shoulder", 'type'] = "S"
        edges.loc[edges["cycleway:right"] == "shared_lane", 'type'] = "S"
        edges.loc[edges["cycleway:right"] == "share_busway", 'type'] = "S"
    except:
        None
    try:
        edges.loc[edges["cycleway:both"] == "shoulder", 'type'] = "S"
        edges.loc[edges["cycleway:both"] == "shared_lane", 'type'] = "S"
        edges.loc[edges["cycleway:both"] == "share_busway", 'type'] = "S"
    except:
        None
    try:
        edges.loc[edges.cycleway == "yes", 'type'] = "L"
        edges.loc[edges.cycleway == "lane", 'type'] = "L"
        edges.loc[edges.cycleway == "opposite_lane", 'type'] = "L"
    except:
        None
    try:
        edges.loc[edges["cycleway:left"] == "yes", 'type'] = "L"
        edges.loc[edges["cycleway:left"] == "lane", 'type'] = "L"
        edges.loc[edges["cycleway:left"] == "opposite_lane", 'type'] = "L"
    except:
        None
    try:
        edges.loc[edges["cycleway:right"] == "yes", 'type'] = "L"
        edges.loc[edges["cycleway:right"] == "lane", 'type'] = "L"
        edges.loc[edges["cycleway:right"] == "opposite_lane", 'type'] = "L"
    except:
        None
    try:
        edges.loc[edges["cycleway:both"] == "yes", 'type'] = "L"
        edges.loc[edges["cycleway:both"] == "lane", 'type'] = "L"
        edges.loc[edges["cycleway:both"] == "opposite_lane", 'type'] = "L"
    except:
        None

    edges.loc[edges.cycleway == "track", 'type'] = "T"
    try:
        edges.loc[edges["cycleway:left"] == "track", 'type'] = "T"
    except:
        None
    try:
        edges.loc[edges["cycleway:right"] == "track", 'type'] = "T"
    except:
        None
    try:
        edges.loc[edges["cycleway:both"] == "track", 'type'] = "T"
    except:
        None

    edges.loc[edges.highway == "cycleway", 'type'] = "P"

    edges = edges[(edges["highway"] != "motorway")]
    edges = edges[(edges["highway"] != "motorway_link")]

    edges = edges[["type","geometry"]]

    edges = gpd.clip(edges,gdf)

    edges.to_file("../" + city + "/shift/bike.geojson", driver='GeoJSON')

    os.system("geo2topo ../" + city + "/shift/bike.geojson > ../" + city + "/shift/bike.topojson -q 1e4")

    os.system("rm ../" + city + "/shift/bike.geojson")





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

    # osm_cycling(city)
    osm_parking(city)


