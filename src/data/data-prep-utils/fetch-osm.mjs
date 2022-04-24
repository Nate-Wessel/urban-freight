import fetch from 'node-fetch'
import { writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { queryOverpass } from './queryOverpass.mjs'
import osmtogeojson from 'osmtogeojson'
import { topology } from 'topojson-server'
import { quantize } from 'topojson-client'

// osm_id's
const cities = {
	Toronto: 324211,
	Calgary: 3227127,
	Edmonton: 2564500,
	Halifax: 9344588, // regional municipality
	Hamilton: 7034910,
	Montreal: 8508277, // urban agglomeration
	Ottawa: 4136816,
	Vancouver: 1852574,
	Victoria: 2221062,
	Winnipeg: 1790696
}

for ( const [name,osm_id] of Object.entries(cities) ){
	console.log(`fetching data for ${name} (OSM relation/${osm_id})`)
	await getBoundary(osm_id,name);
	console.log('waiting 10s before next request')
	await new Promise(resolve => setTimeout(resolve, 10000));
}

async function getBoundary(osm_rel_id,name){
	const query = `
		[out:json][timeout:10];
		( rel(${osm_rel_id}); >; );
		out body qt;
	`
	const response = await queryOverpass(query).then(r=>r.json())
	const geojson = osmtogeojson(response)
	const boundary = geojson.features.find(feat=>/relation/.test(feat.id))
	const topojson = quantize(topology({boundary}),999)
	writeFileSync( `../${name}/boundary.topojson`, JSON.stringify(topojson) )
}

async function getData(osm_rel_id){
	const query = `
		[out:json][timeout:200];
		rel(${osm_rel_id}); map_to_area->.bnd;
		(
		  way[highway~"motorway|motorway_link|primary|primary_link|secondary|secondary_link|tertiary|tertiary_link|trunk|trunk_link|residential|unclassified"](area.bnd);
		  way[highway=cycleway](area.bnd);
		  way[bicycle=designated](area.bnd);
		  way[~"cycleway"~"crossing|lane|share|shoulder|track|yes"](area.bnd);
		  nwr[landuse~"industrial|retail|commercial|grass|grassland|allotments|cemetery|meadow|orchard|greenfield|vineyard|village_green|forest|landfill"](area.bnd);
		  nwr[natural~"wood|forest|beach|scrub|fell|heath|moor|grassland|water|bay|wetland"](area.bnd);
		  nwr[leisure~"park|nature|playground|garden|grass|pitch|common|golf_course|dog_park"](area.bnd);
		  nwr[amenity=parking][parking!~"underground|multi|rooftop"](area.bnd);
		  nwr[water~"river|lake|pond"](area.bnd);
		  nwr[waterway~"riverbank|river|stream"](area.bnd);
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
