import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
import urllib.request
import requests
import json
import os




def dl_ups():

    print("Downloading UPS data")

    urlstring = "https://app-tupssca.herokuapp.com/index.php/stores/near.jsonp?limit=10000&lat=43.712648528677285&lng=-79.36206579586438&n=43.83617338720931&e=-79.09950399916566&s=43.58912367014526&w=-79.6246275925631&_=1613410958291"

    urllib.request.urlretrieve(urlstring, filename="../data-sources/national-data/ups_json_raw.json")

    f = open("../data-sources/national-data/ups_json_raw.json")
    text = f.read()
    json_object = text[1:-1]

    with open("../data-sources/national-data/ups_json_raw.json", "w") as outfile:
        outfile.write(json_object)




def get_ups(city):

    print("Getting UPS pick-up points for", city)

    gdf = gpd.read_file("../" + city + "/boundary.topojson")
    poly = gdf["geometry"][0]

    # UPS locations:

    with open("../data-sources/national-data/ups_json_raw.json") as json_file:
        data = json.load(json_file)

        data = data["response"]

        out = []

        for row in data:
            x = row["Loc"]["lng"]
            y = row["Loc"]["lat"]
            type = "UPS"
            serv = ""
            out.append([x,y,type])

        df = pd.DataFrame(out,columns=["x","y","type"])

        geometry = [Point(xy) for xy in zip(df.x, df.y)]
        df = df.drop(['x', 'y'], axis=1)
        df = gpd.GeoDataFrame(df, crs="EPSG:4326", geometry=geometry)

        df = df[df.within(poly)]

        n = df.shape[0]
        if n > 0:

            df.to_file("../" + city + "/avoid/pts_ups.geojson", driver='GeoJSON')

            os.system("geo2topo ../" + city + "/avoid/pts_ups.geojson > ../" + city + "/avoid/pts_ups.topojson -q 1e4")

            os.system("rm ../" + city + "/avoid/pts_ups.geojson")




def get_fedex(city):

    print("Getting FEDEX pick-up points for", city)

    gdf = gpd.read_file("../" + city + "/boundary.topojson")
    poly = gdf["geometry"][0]

    # FEDEX locations

    x = poly.centroid.x
    y = poly.centroid.y

    urlstring = "https://6-dot-fedexlocationstaging-1076.appspot.com/rest/search/stores?=&projectId=13284125696592996852&where=ST_DISTANCE(geometry,%20ST_POINT(" + str(x) + ",%20"  + str(y) + "))%3C160900&version=published&key=AIzaSyD5KLv9-3X5egDdfTI24TVzHerD7-IxBiE&clientId=WDRP&service=list&select=geometry,%20LOC_ID,%20PROMOTION_ID,%20SEQUENCE_ID,ST_DISTANCE(geometry,%20ST_POINT(" + str(x) + ",%20"  + str(y) + "))as%20distance&orderBy=distance%20ASC&limit=9999&maxResults=9999&_=1613413731212"

    # https://6-dot-fedexlocationstaging-1076.appspot.com/rest/search/stores?=&projectId=13284125696592996852&where=ST_DISTANCE(geometry,%20ST_POINT(-79.2317521,%2043.7764258))%3C160900&version=published&key=AIzaSyD5KLv9-3X5egDdfTI24TVzHerD7-IxBiE&clientId=WDRP&service=list&select=geometry,%20LOC_ID,%20PROMOTION_ID,%20SEQUENCE_ID,ST_DISTANCE(geometry,%20ST_POINT(-79.2317521,%2043.7764258))as%20distance&orderBy=distance%20ASC&limit=9999&maxResults=9999&_=1613413731212

    url = requests.get(urlstring)
    text = url.text
    df_fedex = json.loads(text)

    df_fedex = gpd.GeoDataFrame.from_features(df_fedex)
    
    df_fedex = df_fedex[df_fedex.within(poly)]

    df_fedex["type"] = "Fedex"

    df_fedex = df_fedex[["type","geometry"]]

    df_fedex["serv"] = ""

    n = df_fedex.shape[0]
    if n > 0:

        df_fedex.to_file("../" + city + "/avoid/pts_fedex.geojson", driver='GeoJSON')

        os.system("geo2topo ../" + city + "/avoid/pts_fedex.geojson > ../" + city + "/avoid/pts_fedex.topojson -q 1e4")

        os.system("rm ../" + city + "/avoid/pts_fedex.geojson")




def get_penguin(city):

    print("Getting Penguin pick-up points for", city)

    gdf = gpd.read_file("../" + city + "/boundary.topojson")
    poly = gdf["geometry"][0]

    df = gpd.read_file("../data-sources/national-data/penguin.geojson")
    
    df = df[df.within(poly)]

    n = df.shape[0]
    if n > 0:

        df.to_file("../" + city + "/avoid/pts_penguin.geojson", driver='GeoJSON')

        os.system("geo2topo ../" + city + "/avoid/pts_penguin.geojson > ../" + city + "/avoid/pts_penguin.topojson -q 1e4")

        os.system("rm ../" + city + "/avoid/pts_penguin.geojson")




def get_purolator(city):

    # need to manually download from their sit, a wget or whatever doesnt work, IP blocking probably
    # https://api.purolator.com/locator/puro/json/location/byCoordinates/44.62457/-63.57300?radialDistanceInKM=200&maxNumberofLocations=1000

    print("Getting Purolator pick-up points for", city)

    gdf = gpd.read_file("../" + city + "/boundary.topojson")
    poly = gdf["geometry"][0]

    with open("../" + city + "/avoid/purolator_raw.json") as json_file:# get_ups(city)
        data = json.load(json_file)

    out = []

    for i in data["locations"]:

        type = "Purol"

        y = i["latitude"]
        x = i["longitude"]

        if i['locationType'] == "QuickStopAgent":

            serv = "Services: Prepaid shipping, missed delivery pickup"

        elif i['locationType'] == "QuickStopKiosk":

            serv = "Services: Outbound shipping and pickup"

        elif i['locationType'] == "Staples":

            serv = "Services: Outbound shipping only"

        elif i['locationType'] == "ShippingAgent":

            serv = "Services: Outbound shipping and pickup"

        else:

            serv = "Services: Prepaid outbound shipping"

        out.append([x,y,type,serv])


    df = pd.DataFrame(out,columns=["x","y","type","serv"])

    geometry = [Point(xy) for xy in zip(df.x, df.y)]
    df = df.drop(['x', 'y'], axis=1)
    df = gpd.GeoDataFrame(df, crs="EPSG:4326", geometry=geometry)

    df = df[df.within(poly)]


    n = df.shape[0]
    if n > 0:

        df.to_file("../" + city + "/avoid/pts_purolator.geojson", driver='GeoJSON')

        os.system("geo2topo ../" + city + "/avoid/pts_purolator.geojson > ../" + city + "/avoid/pts_purolator.topojson -q 1e4")

        os.system("rm ../" + city + "/avoid/pts_purolator.geojson")






# dl_ups()

for city in ["Calgary", "Edmonton", "Halifax", "Hamilton", "Ottawa", "Toronto", "Vancouver", "Victoria", "Winnipeg"]:

    get_purolator(city)
    get_ups(city)
    get_penguin(city)
    get_fedex(city)
