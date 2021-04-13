library('tidyverse')
library('lubridate')
library('data.table') # like

setwd('/var/www/html/urban-freight/src/data/fuel-price/')

read_csv('18100001.csv') %>%
	mutate( 
		year = year(date(parse_date_time(REF_DATE,'ym'))),
		fuel = ifelse(`Type of fuel` %like% 'gasoline','gasoline','diesel')
	) %>%
	filter( 
		year == 2020 & 
		`Type of fuel` %like% 'self' &
		GEO %like% '^Toronto|^Edmonton|^Vancouver'
	) %>%
	group_by( GEO, year, fuel	) %>%
	summarise( avg = mean(VALUE) ) %>%
	write_csv('yearly-average.csv')

read_csv('GEOTAB.csv') %>%
	filter( City %like% '^Toronto|^Edmonton|^Vancouver' ) %>%
	mutate( 
		kmpl_HDT =  (MPG_HDT * 1.609344) / 4.54609,
		kmpl_MDT =  (MPG_MDT * 1.609344) / 4.54609
	) %>%
	select( City, kmpl_HDT, kmpl_MDT ) %>%
	write_csv('kmpl.csv')
