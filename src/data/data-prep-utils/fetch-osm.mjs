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
	console.log(`fetching data for ${osm_id}`)
	await getData(osm_id);
}

async function getData(osm_rel_id){
	const query = `
		[out:json][timeout:100];
		rel(${osm_rel_id}); map_to_area->.bnd;
		(
		  way[highway=cycleway](area.bnd);
		  way[bicycle=designated](area.bnd);
		  way[~"cycleway"~"crossing|lane|share|shoulder|track|yes"](area.bnd);
		  nwr[landuse](area.bnd);
		  nwr[natural~"wood|forest|beach|scrub|fell|heath|moor|grassland"](area.bnd);
		  nwr[leisure~"park|nature|playground|garden|grass|pitch|common"](area.bnd);
		  nwr[amenity=parking][parking!~"underground|multi|rooftop"](area.bnd);
		);
		out body;
		>;
		out skel qt;
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
