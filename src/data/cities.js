import Calgary from './Calgary/data.js'
import Edmonton from './Edmonton/data.js'
import Halifax from './Halifax/data.js'
import Hamilton from './Hamilton/data.js'
import Ottawa from './Ottawa/data.js'
import Toronto from './Toronto/data.js'
import Vancouver from './Vancouver/data.js'
import Victoria from './Victoria/data.js'
import Winnipeg from './Winnipeg/data.js'

export const cities = [
	{
		name: 'Toronto',
		bounds: [[43.8588,-79.6495],[43.5774,-79.1098]],
		data: Toronto
	},
	{
		name: 'Vancouver',
		bounds: [[49.31,-123.2247],[49.19,-122.9782]],
		data: Vancouver
	},
	{
		name: 'Edmonton',
		bounds: [[53.6914,-113.7373],[53.3948,-113.2787]],
		data: Edmonton
	},
	{
		name: 'Ottawa',
		bounds: [[45.619,-76.434],[44.9,-75.154]],
		data: Ottawa
	},
	{
		name: 'Calgary',
		bounds: [[51.2230,-114.3538],[50.84257,-113.81025]],
		data: Calgary
	},
	{
		name: 'Halifax',
		bounds: [[44.5811,-63.72265],[44.71121,-63.54319]],
		data: Halifax
	},
	{
		name: 'Hamilton',
		bounds: [[43.0505,-80.2485],[43.4706,-79.6221]],
		data: Hamilton
	},
	{
		name: 'Victoria',
		bounds: [[48.4028,-123.398],[48.4504,-123.3224]],
		data: Victoria
	},
	{
		name: 'Winnipeg',
		bounds: [[49.713,-97.349],[49.994,-96.956]],
		data: Winnipeg
	},
]
