import fetch from 'node-fetch'
import { writeFileSync } from 'fs'

// osm_id's
const cityRelations = [
	3227127, // calgary
	2564500, // edmonton
	9344588, // halifax regional municipality
	7034910, // hamilton
	8508277, // montreal urban agglomeration
	4136816, // ottawa
	324211,  // toronto
	1852574, // vancouver
	2221062, // victoria
	1790696  // winnipeg
]

for ( const osm_id of cityRelations ){
	console.log(osm_id)
	await getData(osm_id);
}

async function getData(osm_rel_id){
	const query = `
		[out:json];
		rel(${osm_rel_id});
		out body;
	`
	const options = { 
		method: 'post',
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({ data: query }).toString()
	};
	await fetch('https://overpass-api.de/api/interpreter',options)
		.then( response => response.json() )
		.then(data => {
			writeFileSync(`temp/${osm_rel_id}.json`,JSON.stringify(data))
		} )
}

console.log('Done!')
