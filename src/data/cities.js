import Calgary from './Calgary/data.js'
import Edmonton from './Edmonton/data.js'
import Halifax from './Halifax/data.js'
import Hamilton from './Hamilton/data.js'
import Montreal from './Montreal/data.js'
import Ottawa from './Ottawa/data.js'
import Toronto from './Toronto/data.js'
import Vancouver from './Vancouver/data.js'
import Victoria from './Victoria/data.js'
import Winnipeg from './Winnipeg/data.js'

export const cities = [
	{
		name: 'Toronto', data: Toronto,
		bounds: [[43.8588,-79.6495],[43.5774,-79.1098]]
	},
	{
		name: 'Montreal', data: Montreal,
		bounds: [[45.712,-74.014],[45.376,-73.455]]
	},
	{
		name: 'Vancouver', data: Vancouver,
		bounds: [[49.31,-123.2247],[49.19,-122.9782]]
	},
	{
		name: 'Edmonton', data: Edmonton,
		bounds: [[53.6914,-113.7373],[53.3948,-113.2787]]
	},
	{
		name: 'Ottawa', data: Ottawa,
		bounds: [[45.619,-76.434],[44.9,-75.154]]
	},
	{
		name: 'Calgary', data: Calgary,
		bounds: [[51.2230,-114.3538],[50.84257,-113.81025]]
	},
	{
		name: 'Halifax', data: Halifax,
		bounds: [[44.89738,-64.09508],[44.41868,-62.69731]]
	},
	{
		name: 'Hamilton', data: Hamilton,
		bounds: [[43.0505,-80.2485],[43.4706,-79.6221]]
	},
	{
		name: 'Victoria', data: Victoria,
		bounds: [[48.4028,-123.398],[48.4504,-123.3224]]
	},
	{
		name: 'Winnipeg', data: Winnipeg,
		bounds: [[49.713,-97.349],[49.994,-96.956]]
	},
]
