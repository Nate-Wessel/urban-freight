export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson')
	},
	avoid: {
		parkingSearchTime: require('./avoid/avg-time-to-park.csv')
	},
	shift: {
		bikeShare: require('./shift/station_information.json')
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson')
	}
}
