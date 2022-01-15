export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: true }
	},
	avoid: {
		parkingSearchTime: require('./avoid/parking-search-time.topojson'),
		pickupPoints: require('./avoid/pickup_pts.topojson')
	},
	shift: {
		bikePaths: require('./shift/bike.topojson'),
		bikeShare: 'https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information',
		parking: require('./shift/lu_parking.topojson')
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson')
	}
}