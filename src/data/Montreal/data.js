export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: true }
	},
	avoid : {},
	shift: {
		bikeShare: 'https://gbfs.velobixi.com/gbfs/en/station_information.json'
	},
	improve: {}
}
