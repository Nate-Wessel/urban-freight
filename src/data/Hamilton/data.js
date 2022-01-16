export default {
	base: {
		boundary: require('./boundary.topojson')
	},
	avoid: {
		parkingSearchTime: require('./avoid/avg-time-to-park.csv')
	}
}
