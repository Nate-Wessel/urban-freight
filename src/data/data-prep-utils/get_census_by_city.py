import pandas as pd
import geopandas as gpd
import zipfile
import os


# CSD code of cities needed for querying census data

city_csd = {
    "Toronto": "3520005",
    "Edmonton": "4811061",
    "Vancouver": "5915022",
    "Calgary": "4806016"
}



# get DA boundaries with data (population and employment density)

def get_da(cityin):

    print("Generating DA polygon data for", cityin)

    csdin = city_csd[cityin]

    # load gaf, get the DAs we need

    dfg = pd.read_csv("../data-sources/national-data/gaf_2016.csv", dtype = "str")
    dfg = dfg[dfg["csduid"] == csdin]
    dfg = dfg[["csduid","dauid"]]
    dfg = dfg.drop_duplicates()

    # get the spatial boundaries

    gdf = gpd.read_file("../data-sources/national-data/da_2016/da_2016.shp", dtype = "str")
    gdf = gdf.merge(dfg, how = "inner", left_on = "DAUID", right_on = "dauid")
    del gdf["DAUID"], gdf["CDUID"], gdf["CSDUID"]

    # get population, join to the spatial data

    dfg = pd.read_csv("../data-sources/national-data/gaf_2016.csv", dtype = "str")
    dfg = dfg[dfg["csduid"] == csdin]

    dfg["dbpop"] = dfg["dbpop"].astype(int)
    dfg["dbarea"] = dfg["dbarea"].astype(float)

    dfp = dfg.groupby(['dauid']).sum()

    gdf = gdf.merge(dfp, how = "left", left_on = "dauid", right_on = "dauid")

    # get employment, join to the spatial data

    dfg = pd.read_csv("../data-sources/national-data/gaf_2016.csv", dtype = "str")
    dfg = dfg[dfg["csduid"] == csdin]
    dfg = dfg[["csduid","dauid"]]
    dfg = dfg.drop_duplicates()

    dfe = pd.read_csv("../data-sources/national-data/employment_total_2016.csv")
    dfe = dfg.merge(dfe, how = "inner", left_on = "dauid", right_on = "geoid")
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

    del gdf["total_emp"], gdf["dbpop"], gdf["dbarea"], gdf["csduid"]

    gdf.to_file("../data-sources/" + cityin + "/da_polygons.geojson", driver='GeoJSON')

    os.system("geo2topo ../data-sources/" + cityin + "/da_polygons.geojson > ../data-sources/" + cityin + "/da_polygons.topojson -q 1e4")





###################
# block level residential land use
###################

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




# city = "Edmonton"
# csd = "4811061"

# # get_csd(csd,city)
# # get_da(csd,city)
# get_blockres(csd,city)



# get_csd(csd,city)
# get_da(csd,city)
get_da("Calgary")

# city = "Vancouver"
# csd = "5915022"

# # get_csd(csd,city)
# # get_da(csd,city)
# get_blockres(csd,city)
