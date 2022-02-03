import pandas as pd
import geopandas as gpd
import pyrosm
from shapely.validation import make_valid
from requests import get
import codecs
import osm2geojson
import json

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

	print("Generating OSM land-use layers for", city)

	gdf = gpd.read_file("../" + city + "/boundary.topojson")
	gdf.crs = "epsg:4326"   

	osm_id = city_osm[city]

	with codecs.open("../data-sources/osm-data/" + str(osm_id) + ".osm", 'r', encoding='utf-8') as data:
		json = data.read()

	geojson = osm2geojson.json2geojson(json, filter_used_refs=False, log_level='INFO')

	osm = gpd.GeoDataFrame.from_features(geojson)

	osm = osm[(osm.geometry.geometry.type!='Point')]

	osm = osm[(osm["type"] == "relation") | (osm["type"] == "way")]

	osm["tags"] = osm["tags"].astype('string')

	osm.crs = "epsg:4326"

	osm = osm[["geometry","tags","type"]]

	osm = gpd.clip(osm,gdf)



	# industrial

	print("industrial")	

	industrial = osm[(osm["tags"].str.contains("industrial|landfill"))]	
	
	industrial = industrial[["geometry"]]

	industrial.to_file("../data-sources/osm-data/" + city + "/lu_industrial.geojson", driver='GeoJSON')

	# retail / commercial

	print("retail")

	retail = osm[(osm["tags"].str.contains("retail|commercial"))]	
	
	retail = retail[["geometry"]]

	retail.to_file("../data-sources/osm-data/" + city + "/lu_retail.geojson", driver='GeoJSON')

	# green

	print("green space")

	filter = "leisure|wood|forest|beach|scrub|fell|heath|moor|grass|allotments|cemetery|meadow|orchard|greenfield|vineyard|village_green|forest"

	green = osm[(osm["tags"].str.contains(filter))]	
	
	green = green[["geometry"]]

	green.to_file("../data-sources/osm-data/" + city + "/lu_green.geojson", driver='GeoJSON')



	# roads

	print("roads")

	filter = "residential|unclassified"

	roads = osm[(osm["type"] == "way") & (osm["tags"].str.contains(filter))]
	
	roads = roads[["geometry"]]

	roads.to_file("../data-sources/osm-data/" + city + "/lu_roads_local.geojson", driver='GeoJSON')

	filter = "motorway|motorway_link|trunk|trunk_link"

	roads = osm[(osm["type"] == "way") & (osm["tags"].str.contains(filter))]	
	
	roads = roads[["geometry"]]

	try:
		roads.to_file("../data-sources/osm-data/" + city + "/lu_roads_highway.geojson", driver='GeoJSON')
	except:
		None

	filter = "primary|primary_link|secondary|secondary_link|tertiary|tertiary_link"

	roads = osm[(osm["type"] == "way") & (osm["tags"].str.contains(filter))]	
	
	roads = roads[["geometry"]]

	roads.to_file("../data-sources/osm-data/" + city + "/lu_roads_major.geojson", driver='GeoJSON')


	
	# water

	print("water")

	filter = "river|lake|pond|riverbank|stream"

	water = osm[((osm.geometry.geometry.type=='LineString') | (osm.geometry.geometry.type=='MultiLineString')) & (osm["tags"].str.contains(filter)) & (osm["tags"].str.contains("water|natural"))]

	water = water[["geometry"]]

	try:
		water.to_file("../data-sources/osm-data/" + city + "/lu_water_line.geojson", driver='GeoJSON')
	except:
		None

	water = osm[((osm.geometry.geometry.type=='Polygon') | (osm.geometry.geometry.type=='MultiPolygon')) & (osm["tags"].str.contains(filter)) & (osm["tags"].str.contains("water|natural"))]

	water = water[["geometry"]]

	try:
		water.to_file("../data-sources/osm-data/" + city + "/lu_water_poly.geojson", driver='GeoJSON')
	except:
		None

	# boundary

	gdf = gpd.read_file("../" + city + "/da_polygons.topojson")
	gdf.crs = "epsg:4326"
	gdf = gdf[["geometry"]]
	gdf.to_file("../data-sources/osm-data/" + city + "/lu_boundary.geojson", driver='GeoJSON')





# block level residential land use

def get_blockres(city):

	print("Generating residential land-use layer for", city)

	city_csd = {
		"Calgary": "4806016",
		"Edmonton": "4811061",
		"Halifax": "1209034",
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

	dfb.to_file("../data-sources/osm-data/" + city + "/lu_res.geojson", driver='GeoJSON')




# osm_land_use("Victoria")
# get_blockres("Victoria")

for city in ["Calgary", "Edmonton", "Halifax", "Hamilton", "Montreal", "Ottawa", "Toronto", "Vancouver", "Victoria", "Winnipeg"]:

	osm_land_use(city)
	get_blockres(city)