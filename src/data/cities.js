import Toronto from './Toronto/data.js'
import Vancouver from './Vancouver/data.js'
import Edmonton from './Edmonton/data.js'
import Ottawa from './Ottawa/data.js'

export const cities = [
	{
		name: 'Toronto',
		bounds: [[43.8588,-79.6495],[43.5774,-79.1098]],
		geohashSqM: 16890.339665499243,
		data: Toronto
	},
	{
		name: 'Vancouver',
		bounds: [[49.31,-123.2247],[49.19,-122.9782]],
		geohashSqM: 15267.902190214854,
		data: Vancouver
	},
	{
		name: 'Edmonton',
		bounds: [[53.6914,-113.7373],[53.3948,-113.2787]],
		geohashSqM: 13919.639948047059,
		data: Edmonton
	},
	{
		name: 'Ottawa',
		bounds: [[45.619,-76.434],[44.9,-75.154]],
		geohashSqM: 16890, // TODO what is this variable??
		data: Ottawa
	}
]
