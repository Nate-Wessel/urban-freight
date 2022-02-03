import fetch from 'node-fetch'
import { writeFileSync } from 'fs'
import { execSync } from 'child_process'

// osm_id's
const cityRelations = [
	// 3227127, // calgary
	// 2564500, // edmonton
	// 9344588, // halifax regional municipality
	// 7034910, // hamilton
	// 8508277, // montreal urban agglomeration
	// 4136816, // ottawa
	
	// 324211,  // toronto
	// 1852574, // vancouver
	2221062 // victoria
	// 1790696  // winnipeg
]

for ( const osm_id of cityRelations ){
	console.log(`fetching data for ${osm_id}`)
	await getData(osm_id);
	console.log('waiting 60s before next request')
	await new Promise(resolve => setTimeout(resolve, 60000));
}

async function getData(osm_rel_id){
	const query = `
		[out:xml][timeout:100];
		rel(${osm_rel_id}); map_to_area->.bnd;
		(
		  way[highway~"motorway|motorway_link|primary|primary_link|secondary|secondary_link|tertiary|tertiary_link|trunk|trunk_link|residential|unclassified"](area.bnd);
		  way[highway=cycleway](area.bnd);
		  way[bicycle=designated](area.bnd);
		  way[~"cycleway"~"crossing|lane|share|shoulder|track|yes"](area.bnd);
		  relation[landuse~"industrial|retail|commercial|grass|grassland|allotments|cemetery|meadow|orchard|greenfield|vineyard|village_green|forest"](area.bnd);
		  relation[natural~"wood|forest|beach|scrub|fell|heath|moor|grassland|water|bay|wetland"](area.bnd);
		  relation[leisure~"park|nature|playground|garden|grass|pitch|common|golf_course"](area.bnd);
		  relation[amenity=parking][parking!~"underground|multi|rooftop"](area.bnd);
		  relation[water~"river|lake|pond"](area.bnd);
		  relation[waterway~"riverbank|river|stream"](area.bnd);
		  way[water~"river|lake|pond"](area.bnd);
		  way[waterway~"riverbank|river|stream"](area.bnd);
		  
		);
		(._;>;);
		out body qt;
	`
	const options = { 
		method: 'post',
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({ data: query }).toString()
	};
	await fetch('https://overpass-api.de/api/interpreter',options)
		.then( response => response.text() )
		.then( data => {
			const dir = '../data-sources/osm-data'
			const xmlFilePath = `${dir}/${osm_rel_id}.osm`
			const pbfFilePath = `${dir}/${osm_rel_id}.pbf`
			writeFileSync( xmlFilePath, data )
			try {
				execSync(`osmconvert ${xmlFilePath} -o=${pbfFilePath}`)
			} catch {
				console.log('there may have been an error converting to pbf')
			}
		} )
}

console.log('Done!')
