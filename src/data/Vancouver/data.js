export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: true }
	},
	avoid: {},
	shift: {
		bikeShare: require('./shift/station_information.json')
	},
	improve: {}
}
