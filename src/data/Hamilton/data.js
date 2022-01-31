export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: false }
	},
	avoid: {
		parkingSearchTime: require('./avoid/avg-time-to-park.csv'),
		pickupPoints: {
			fedex: require('./avoid/pts_fedex.topojson'),
			penguin: require('./avoid/pts_penguin.topojson'),
			purolator: require('./avoid/pts_purolator.topojson'),
			ups: require('./avoid/pts_ups.topojson')
		}
	},
	shift: {
		bikeShare: require('./shift/station_information.json'),
		bikePaths: require('./shift/bike.topojson'),
		parking: require('./shift/lu_parking.topojson')
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson'),
		missing: ['e1']
	}
}
