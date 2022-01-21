export default {
	base: {
		boundary: require('./boundary.topojson'),
		tiles: { transit: false, landuse: false }
	},
	shift: {
		bikeShare: 'https://gbfs.velobixi.com/gbfs/en/station_information.json',
	},

}
