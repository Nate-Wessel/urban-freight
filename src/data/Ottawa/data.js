export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: false }
	},
	avoid: {
		parkingSearchTime: require('./avoid/avg-time-to-park.csv')
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson')
	}
}
