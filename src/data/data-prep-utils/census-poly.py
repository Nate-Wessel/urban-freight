import pandas as pd
import geopandas as gpd
import zipfile
import os


# CSD code of cities needed for querying census data

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


# get DA boundaries with data (population and employment density)

def get_da(cityin):

    print("Generating DA polygon data for", cityin)

    cen_id = city_csd[cityin]

    # load gaf, get the DAs we need

    if len(cen_id) == 8:

        dfg = pd.read_csv("../data-sources/national-data/gaf_2016.csv", dtype = "str")
        dfg = dfg[dfg["csduid"] == cen_id]

    elif len(cen_id) == 4:

        dfg = pd.read_csv("../data-sources/national-data/gaf_2016.csv", dtype = "str")
        dfg = dfg[dfg["cduid"] == cen_id]
    
    dfda = dfg[["csduid","dauid","cduid"]]
    dfda = dfda.drop_duplicates()


    # get the spatial boundaries

    gdf = gpd.read_file("../data-sources/national-data/da_2016/da_2016.shp", dtype = "str")
    gdf = gdf.merge(dfda, how = "inner", left_on = "DAUID", right_on = "dauid")
    del gdf["DAUID"], gdf["CDUID"], gdf["CSDUID"]


    # get population, join to the spatial data

    dfg["dbpop"] = dfg["dbpop"].astype(int)
    dfg["dbarea"] = dfg["dbarea"].astype(float)

    dfp = dfg.groupby(['dauid']).sum()

    gdf = gdf.merge(dfp, how = "left", left_on = "dauid", right_on = "dauid")

    # get employment, join to the spatial data

    dfe = pd.read_csv("../data-sources/national-data/employment_total_2016.csv")
    dfe = dfda.merge(dfe, how = "inner", left_on = "dauid", right_on = "geoid")
    del dfe["geoid"]
    dfe["total_emp"] = dfe["total_emp"].astype(int)

    dfe = dfe.groupby(['dauid']).sum()

    gdf = gdf.merge(dfe, how = "left", left_on = "dauid", right_on = "dauid")

    # # calc densities and output

    gdf = gdf.fillna(0)

    gdf["dp"] = gdf["dbpop"] / gdf["dbarea"]
    gdf["de"] = gdf["total_emp"] / gdf["dbarea"]

    gdf["dp"] = gdf["dp"].astype(int)
    gdf["de"] = gdf["de"].astype(int)

    

    del gdf["total_emp"], gdf["dbpop"], gdf["dbarea"], gdf["csduid"], gdf["cduid"]

    # output to topojson

    gdf.to_file("../" + cityin + "/da_polygons.geojson", driver='GeoJSON')

    os.system("geo2topo ../" + cityin + "/da_polygons.geojson > ../" + cityin + "/da_polygons.topojson -q 1e4")

    os.system("rm ../" + cityin + "/da_polygons.geojson")



# block level residential land use
# NEED TO UPDATE STILL

def get_blockres(csdin,cityin):

    dfg = pd.read_csv("national-data/census/gaf_2016.csv", dtype = "str")
    dfg = dfg[dfg["csduid"] == csdin]
    dfg = dfg[["csduid","dbuid","dbpop","dauid"]]
    dfg["dbpop"] = dfg["dbpop"].astype(int)

    dfb = gpd.read_file("national-data/census/blocks_2016/census_blocks_2016.shp")
    dfb = dfb.merge(dfg, how = "right", left_on = "DBUID", right_on = "dbuid")

    dfb= dfb.to_crs({'init': 'epsg:3857'})
    dfb["area"] = dfb['geometry'].area/ 10**6
    dfb= dfb.to_crs({'init': 'epsg:4326'})

    dfb["popdens"] = dfb["dbpop"] / dfb["area"]

    dfb = dfb[dfb["popdens"] > 100]

    dfb = dfb.dissolve(by='csduid')

    dfb.to_file(cityin + "/census/blocks_residential.geojson", driver='GeoJSON')

    os.system("geo2topo " + cityin + "/census/blocks_residential.geojson > " + cityin + "/census/blocks_residential.topojson -q 1e4")




get_da("Montreal")

# for city in ["Calgary", "Edmonton", "Halifax", "Hamilton", "Ottawa", "Toronto", "Vancouver", "Victoria", "Winnipeg"]:

#     get_da(city)



