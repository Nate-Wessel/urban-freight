export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson')
	},
	avoid: {
		parkingSearchTime: require('./avoid/avg-time-to-park.csv'),
		pickupPoints: {
			fedex: require('./avoid/pts_fedex.topojson'),
			purolator: require('./avoid/pts_purolator.topojson'),
			ups: require('./avoid/pts_ups.topojson')
		}
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson'),
		missing: ['e1']
	},
	shift: {
		bikePaths: require('./shift/bike.topojson'),
		parking: require('./shift/lu_parking.topojson')
	}
}
