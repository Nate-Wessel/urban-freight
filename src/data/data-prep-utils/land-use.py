import pandas as pd
import geopandas as gpd
import pyrosm
from shapely.validation import make_valid


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


def osm_land_use(city):

    print("Generating land-use layers for", city)

    gdf = gpd.read_file("../" + city + "/boundary.topojson")
    gdf.crs = "epsg:4326"
    gdf.to_file("../" + city + "/land-use/lu_boundary.geojson", driver='GeoJSON')


    osm_id = city_osm[city]

    osm = pyrosm.OSM("../data-sources/osm-data/" + str(osm_id) + ".pbf")

    # industrial

    filter = {"landuse": ["industrial"]}

    industrial = osm.get_data_by_custom_criteria(custom_filter=filter)

    industrial = industrial[["landuse","geometry"]]

    industrial["geom_type"] = industrial.geom_type
    industrial = industrial[industrial["geom_type"].isin(["Polygon","MultiPolygon"])]
    del industrial["geom_type"]

    industrial.crs = "epsg:4326"

    # x = 0
    # while x < industrial.shape[0]:       
    #     industrial["geometry"][x] = make_valid(industrial["geometry"][x])
    #     x += 1

    industrial = industrial.buffer(0.00005)
    industrial = gpd.clip(industrial,gdf)

    industrial.to_file("../" + city + "/land-use/lu_industrial.geojson", driver='GeoJSON')


    # retail / commercial
     
    filter = {"landuse": ["retail","commercial"]}

    retail = osm.get_data_by_custom_criteria(custom_filter=filter)

    retail = retail[["landuse","geometry"]]

    retail["geom_type"] = retail.geom_type
    retail = retail[retail["geom_type"].isin(["Polygon","MultiPolygon"])]
    del retail["geom_type"]

    retail.crs = "epsg:4326"

    # x = 0
    # while x < retail.shape[0]:       
    #     retail["geometry"][x] = make_valid(retail["geometry"][x])
    #     x += 1

    retail = retail.buffer(0.00005)
    retail = gpd.clip(retail,gdf)

    retail.to_file("../" + city + "/land-use/lu_retail.geojson", driver='GeoJSON')


    # green-space

    filter = {
        "leisure": ["park","nature_reserve","playground","garden","grass","pitch","dogpark","common"],
        "natural": ["wood","beach","scrub","fell","heath","moor","grassland"],
        "landuse": ["grass","grassland","allotments","cemetery","meadow","orchard","greenfield","vineyard","village_green","forest"]
    }

    green = osm.get_data_by_custom_criteria(custom_filter=filter, keep_nodes=False, keep_relations=True)

    green = green[["landuse","leisure","natural","geometry"]]

    green["geom_type"] = green.geom_type
    green = green[green["geom_type"].isin(["Polygon","MultiPolygon"])]
    del green["geom_type"]

    green.crs = "epsg:4326"

    # x = 0
    # while x < green.shape[0]:       
    #     green["geometry"][x] = make_valid(green["geometry"][x])
    #     x += 1

    green = green.buffer(0.00005)
    green = gpd.clip(green,gdf)

    green.to_file("../" + city + "/land-use/lu_green.geojson", driver='GeoJSON')

    

    # roads

    edges = osm.get_network(network_type="driving" , nodes=False)

    edges = edges[["highway","geometry"]]

    edges = gpd.clip(edges,gdf)    

    edges.to_file("../" + city + "/land-use/lu_roads.geojson", driver='GeoJSON')



    # water

    filter = {
        "natural": ["water","bay","wetland"],
        "water": ["river","lake","pond"],
        "waterway": ["riverbank", "river","stream"]
    }

    water = osm.get_data_by_custom_criteria(custom_filter=filter)

    water = water[["geometry"]]

    water["geom_type"] = water.geom_type


    water_line = water[water["geom_type"].isin(["LineString","MultiLineString"])]
    del water_line["geom_type"]

    water_line = gpd.clip(water_line,gdf)    

    water_line.to_file("../" + city + "/land-use/lu_water_line.geojson", driver='GeoJSON')


    water_poly = water[water["geom_type"].isin(["Polygon","MultiPolygon"])]
    del water_poly["geom_type"]

    water_poly.crs = "epsg:4326"

    water_poly = water_poly.buffer(0.00005)
    water_poly = gpd.clip(water_poly,gdf)

    water_poly.to_file("../" + city + "/land-use/lu_water_poly.geojson", driver='GeoJSON')


    



# block level residential land use

def get_blockres(city):

    print("Generating residential land-use layer for", city)

    city_csd = {
        "Calgary": "4806016",
        "Edmonton": "4811061",
        "Halifax": "1209034", # might have to update to ccsd for smaller region
        "Hamilton": "3525005",
        "Montreal": "2466",
        "Ottawa": "3506008",
        "Toronto": "3520005",
        "Vancouver": "5915022",
        "Victoria": "5917034",
        "Winnipeg": "4611040"
    }

    cen_id = city_csd[city]

    if len(cen_id) == 7:

        dfg = pd.read_csv("../data-sources/national-data/gaf_2016.csv", dtype = "str")
        dfg = dfg[dfg["csduid"] == cen_id]

    elif len(cen_id) == 4:

        dfg = pd.read_csv("../data-sources/national-data/gaf_2016.csv", dtype = "str")
        dfg = dfg[dfg["cduid"] == cen_id]

    
    dfg = dfg[["csduid","dbuid","dbpop","dauid","cduid"]]
    dfg["dbpop"] = dfg["dbpop"].astype(int)

    dfb = gpd.read_file("../data-sources/national-data/blocks_2016/census_blocks_2016.shp", dtype = "str")
    dfb = dfb.merge(dfg, how = "right", left_on = "DBUID", right_on = "dbuid")

    dfb= dfb.to_crs({'init': 'epsg:3857'})
    dfb["area"] = dfb['geometry'].area/ 10**6
    dfb= dfb.to_crs({'init': 'epsg:4326'})

    dfb["popdens"] = dfb["dbpop"] / dfb["area"]

    dfb = dfb[dfb["popdens"] > 100]

    dfb = dfb.dissolve(by='csduid')

    dfb.to_file("../" + city + "/land-use/lu_res.geojson", driver='GeoJSON')





for city in ["Calgary", "Edmonton", "Halifax", "Hamilton", "Montreal", "Ottawa", "Toronto", "Vancouver", "Victoria", "Winnipeg"]:

     osm_land_use(city)
     get_blockres(city)