export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: true }
	},
	avoid : {
		pickupPoints: {
			fedex: require('./avoid/pts_fedex.topojson'),
			penguin: require('./avoid/pts_penguin.topojson'),
			purolator: require('./avoid/pts_purolator.topojson'),
			ups: require('./avoid/pts_ups.topojson')
		}
	},
	shift: {
		bikeShare: 'https://gbfs.velobixi.com/gbfs/en/station_information.json',
		parking: require('./shift/lu_parking.topojson')	
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson')
	}
}
