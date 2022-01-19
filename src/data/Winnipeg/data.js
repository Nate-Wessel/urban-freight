export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson')
	},
	avoid: {
		parkingSearchTime: require('./avoid/avg-time-to-park.csv')
	}
}
