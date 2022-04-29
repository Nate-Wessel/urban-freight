export default {
	base: {
		boundary: require('./boundary.topojson'),
		DAs: require('./da_polygons.topojson'),
		tiles: { transit: true, landuse: true }
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
		bikeShare: 'https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information'
	},
	improve: {}
}
