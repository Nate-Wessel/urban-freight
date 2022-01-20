## bikeshare

data downloaded from https://hamilton.socialbicycles.com/. Not available directly - monitor the network traffic. reshaped with Node:

```javascript
const fs = require('fs')

const hamData = require('./hamilton.json')

const data = {
	stations: hamData.items.map(d=>{
		return {
			station_id: d.id,
			name: d.name,
			lat: d.middle_point.coordinates[1],
			lon: d.middle_point.coordinates[0],
			capacity: d.racks_amount
		}
	})
}

fs.writeFileSync('./station_information.json',JSON.stringify({data}))
```
