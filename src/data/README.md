# Toronto Bike Share stations

https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information

Can we find comparable data for the other cities?

https://bikeshare-research.org/#bssid:vancouver

https://nabsa.net/resources/gbfs/


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

