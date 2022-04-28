export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: true }
	},
	avoid: {
	pickupPoints: {
			fedex: require('./avoid/pts_fedex.topojson'),
			purolator: require('./avoid/pts_purolator.topojson'),
			ups: require('./avoid/pts_ups.topojson')
		}
	},
	improve: {
		fuelStations: require('./improve/alt_fuel_stations.topojson'),
		missing: ['e1','e3']
	},
	shift: {
		parking: require('./shift/lu_parking.topojson')
	}
}
