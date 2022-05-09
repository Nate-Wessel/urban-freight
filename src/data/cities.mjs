const [avoid,shift,improve,transit,landuse] = [{},{},{},true,true]

export const cities = [
	{
		name: 'Toronto', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, 
			shift: { bikeShare: 'https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information' }
		},
		bounds: [[43.8588,-79.6495],[43.5774,-79.1098]],
		osm_rel: 324211
	},{
		name: 'Montreal', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, 
			shift: { bikeShare: 'https://gbfs.velobixi.com/gbfs/en/station_information.json' }
		},
		bounds: [[45.712,-74.014],[45.376,-73.455]],
		osm_rel: 8508277 // urban agglomeration
	},{
		name: 'Vancouver', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, shift
		},
		bounds: [[49.31,-123.2247],[49.19,-122.9782]],
		osm_rel: 1852574
	},{
		name: 'Edmonton', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, shift
		},
		bounds: [[53.6914,-113.7373],[53.3948,-113.2787]],
		osm_rel: 2564500
	},{
		name: 'Ottawa', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, shift
		},
		bounds: [[45.619,-76.434],[44.9,-75.154]],
		osm_rel: 4136816
	},{
		name: 'Calgary', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, shift
		},
		bounds: [[51.2230,-114.3538],[50.84257,-113.81025]],
		osm_rel: 3227127,
		
	},{
		name: 'Halifax', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, shift
		},
		bounds: [[44.89738,-64.09508],[44.41868,-62.69731]],
		osm_rel: 9344588 // regional municipality
	},{
		name: 'Hamilton', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, shift
		},
		bounds: [[43.0505,-80.2485],[43.4706,-79.6221]],
		osm_rel: 7034910
	},{
		name: 'Victoria', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, shift
		},
		bounds: [[48.4028,-123.398],[48.4504,-123.3224]],
		osm_rel: 2221062
	},{
		name: 'Winnipeg', data: {
			base: { tiles: { transit, landuse } }, avoid, improve, shift
		},
		bounds: [[49.713,-97.349],[49.994,-96.956]],
		osm_rel: 1790696
	},
]
