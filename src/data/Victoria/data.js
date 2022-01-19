export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson')
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson')
	}
}
