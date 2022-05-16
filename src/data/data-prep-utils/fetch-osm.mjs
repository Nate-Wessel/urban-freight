import fetch from 'node-fetch'
import { writeFileSync, readFileSync } from 'fs'
import { execSync } from 'child_process'
import { queryOverpass } from './queryOverpass.mjs'
import osmtogeojson from 'osmtogeojson'
import { topology } from 'topojson-server'
import { quantize, feature } from 'topojson-client'
import { booleanIntersects } from '@turf/turf'

import { cities } from '../cities.mjs'

function boundaryFilePath(city){ return `../${city.name}/boundary.topojson` }
function bikeLaneFilePath(city,year){ 
	return year ?
		`../${city.name}/shift/bike-${year}.topojson` : 
		`../${city.name}/shift/bike.topojson` 
}

for ( const city of cities ){
	await getBoundary(city)
	await getBikeFeatures(city)
	for( const year of [2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012] ){
		await getBikeFeatures(city,year)
	}
}

async function getBoundary(city){
	console.log(`Updating urban boundary for ${city.name}`)
	const query = `
		[out:json][timeout:10];
		( rel(${city.osm_rel}); >; );
		out body qt;`
	const response = await queryOverpass(query).then(r=>r.json())
	const geojson = osmtogeojson(response)
	const boundary = geojson.features.find(feat=>/relation/.test(feat.id))
	const topojson = quantize(topology({boundary}),999)
	writeFileSync( boundaryFilePath(city), JSON.stringify(topojson) )
}

async function getBikeFeatures(city,year=undefined){
	console.log(`Updating bike features for ${city.name}${year?' in '+year:''}`)
	var cityBoundary = JSON.parse(readFileSync(boundaryFilePath(city)))
	const [W,S,E,N] = cityBoundary.bbox
	cityBoundary = feature(cityBoundary,'boundary') // convert to geojson
	const timeParam = year ? `[date:"${year}-01-01T00:00:00Z"]` : ''
	const timeout = year ? 120 : 60
	const query = `
		[out:json][timeout:${timeout}]${timeParam}[bbox:${S},${W},${N},${E}];
		(
			way[highway=cycleway];
			way[bicycle=designated];
		  	way[~"cycleway"~"crossing|lane|share|shoulder|track|yes"];
		);
		(._;>;);
		out body qt;`
	const response = await queryOverpass(query).then(r=>r.json())
	const geojson = osmtogeojson(response)
	geojson.features = geojson.features
		.filter( feat => /way/.test(feat.id) )
		.filter( feat => booleanIntersects(feat,cityBoundary) )
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
		bikeLaneFilePath(city,year), 
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
