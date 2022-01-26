# Toronto Bike Share stations

https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information

Can we find comparable data for the other cities?

https://bikeshare-research.org/#bssid:vancouver

https://nabsa.net/resources/gbfs/


# Alternative Fuel / Electric Charging Stations

Sourced from NRCAN

https://www.nrcan.gc.ca/energy-efficiency/transportation-alternative-fuels/electric-charging-alternative-fuelling-stationslocator-map/20487#/find/nearest

But the public data come from this API

https://developer.nrel.gov/api/alt-fuel-stations/v1.geojson?fuel_type=all&country=CA&api_key=MVBU7hCe2w67hLeab4kYyZly0INT724iJ4syGsIM



# Parcel Pick-UP locations

## UPS:

All data is downloaded from the UPS site (https://www.theupsstore.ca/store-finder/) via their API:
 
e.g. https://app-tupssca.herokuapp.com/index.php/stores/near.jsonp?limit=10000&lat=43.712648528677285&lng=-79.36206579586438&n=43.83617338720931&e=-79.09950399916566&s=43.58912367014526&w=-79.6246275925631&_=1613410958291

## Penguin Pick Up

Manually grabbed from https://www.penguinpickup.com/

## Fedex

From Fedex webset (https://www.fedex.com/locate/) via API:

e.g. https://6-dot-fedexlocationstaging-1076.appspot.com/rest/search/stores?=&projectId=13284125696592996852&where=ST_DISTANCE(geometry,%20ST_POINT(-79.2317521,%2043.7764258))%3C160900&version=published&key=AIzaSyD5KLv9-3X5egDdfTI24TVzHerD7-IxBiE&clientId=WDRP&service=list&select=geometry,%20LOC_ID,%20PROMOTION_ID,%20SEQUENCE_ID,ST_DISTANCE(geometry,%20ST_POINT(-79.2317521,%2043.7764258))as%20distance&orderBy=distance%20ASC&limit=9999&maxResults=9999&_=1613413731212

## Purolator

Manually download from their site https://www.purolator.com/en/shipping/find-shipping-centre

Can use this API, but has to be done in-browser

https://api.purolator.com/locator/puro/json/location/byCoordinates/45.4938/-73.6287?radialDistanceInKM=200&maxNumberofLocations=1000




# notes on parking search time data

Data is from GeoTab Ignition https://ignition.geotab.com

As of 2022-01 there is no data available for Victoria or Montreal.

```sql
SELECT 
	geohash,city,avgtimetopark
FROM `geotab-public-intelligence.UrbanInfrastructure.SearchingForParking`
WHERE 
	country = 'Canada' AND
	city IN (
		'Edmonton','Toronto','Vancouver','Calgary'
		'Halifax','Hamilton','Ottawa','Winnipeg'
	)
```

export as CSV then split up by city, e.g.

```r
library('tidyverse')

read_csv('~/ignition.csv') %>%
	filter(city=='Winnipeg') %>%
	select(geohash,avgtimetopark) %>%
	write_csv('~/avg-time-to-park.csv')
```

putting each file in the appropriate city folder

