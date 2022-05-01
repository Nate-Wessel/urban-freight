export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: true }
	},
	avoid: {},
	shift: {
		bikeShare: 'https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information'
	},
	improve: {}
}
