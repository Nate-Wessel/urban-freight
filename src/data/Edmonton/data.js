export default {
	boundary: require('./boundary.topojson'),
	avoid: {
		parkingSearchTime: require('./avoid/parking-search-time.topojson'),
		pickupPoints: require('./avoid/pickup_pts.topojson')
	},
	shift: {
		bikePaths: require('./shift/bike.topojson'),
		parking: require('./shift/lu_parking.topojson')
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson')
	}
}
