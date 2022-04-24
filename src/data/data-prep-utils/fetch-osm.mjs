import fetch from 'node-fetch'
import { writeFileSync, readFileSync } from 'fs'
import { execSync } from 'child_process'
import { queryOverpass } from './queryOverpass.mjs'
import osmtogeojson from 'osmtogeojson'
import { topology } from 'topojson-server'
import { quantize } from 'topojson-client'

// osm_id's
const cities = [
	{ name: 'Toronto', osm_rel: 324211 },
	{ name: 'Calgary', osm_rel: 3227127 },
	{ name: 'Edmonton', osm_rel: 2564500 },
	{ name: 'Halifax', osm_rel: 9344588 }, // regional municipality
	{ name: 'Hamilton', osm_rel: 7034910 },
	{ name: 'Montreal', osm_rel: 8508277 }, // urban agglomeration
	{ name: 'Ottawa', osm_rel: 4136816 },
	{ name: 'Vancouver', osm_rel: 1852574 },
	{ name: 'Victoria', osm_rel: 2221062 },
	{ name: 'Winnipeg', osm_rel: 1790696 }
]

function boundaryFile(city){ return `../${city.name}/boundary.topojson` }
function bikeLaneFile(city){ return `../${city.name}/shift/bike2.topojson` }

for ( const city of cities ){
	console.log(`fetching data for ${city.name} (OSM relation/${city.osm_rel})`)
	await getBoundary(city)
	await getCurrentBikeFeatures(city)
	console.log('waiting 10s before next request')
	await new Promise(resolve => setTimeout(resolve, 10000));
}

async function getBoundary(city){
	const query = `
		[out:json][timeout:10];
		( rel(${city.osm_rel}); >; );
		out body qt;`
	const response = await queryOverpass(query).then(r=>r.json())
	const geojson = osmtogeojson(response)
	const boundary = geojson.features.find(feat=>/relation/.test(feat.id))
	const topojson = quantize(topology({boundary}),999)
	writeFileSync( boundaryFile(city), JSON.stringify(topojson) )
}

async function getCurrentBikeFeatures(city){
	const [W,S,E,N] = JSON.parse(readFileSync(boundaryFile(city))).bbox
	const query = `
		[out:json][timeout:60][bbox:${S},${W},${N},${E}];
		(
			way[highway=cycleway];
			way[bicycle=designated];
		  	way[~"cycleway"~"crossing|lane|share|shoulder|track|yes"];
		);
		(._;>;);
		out body qt;`
	const response = await queryOverpass(query).then(r=>r.json())
	const geojson = osmtogeojson(response)
	geojson.features = geojson.features.filter( feat => /way/.test(feat.id) )
	geojson.features.map( feat => {
		let props = feat.properties
		const segregated = Object.entries(props)
			.filter( ([key,val]) => /cycleway/.test(key) )
			.some( ([key,val]) => /yes|track|^lane|opposite_lane/.test(val) )
		if(segregated){ return feat.properties = {type:'L'} }
		const route = Object.entries(props)
			.filter( ([key,val]) => /cycleway/.test(key) )
			.some( ([key,val]) => /shoulder|share/.test(val) )
		if(route){ return feat.properties = {type:'S'} } 
		feat.properties = {type:'O'}
	} )
	const topojson = topology({bike:geojson})
	writeFileSync( 
		bikeLaneFile(city), 
		JSON.stringify(quantize(topojson,9999)) 
	)
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
