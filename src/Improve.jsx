import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, LayerGroup } from 'react-leaflet'
import { GeoJSON } from 'leaflet'
import { scaleOrdinal } from 'd3-scale'

const color = scaleOrdinal()
	.domain(['ELEC','CNG','LPG'])
	.range(['red','green','blue'])

const data = {
	Toronto: require('./data/Toronto/alt_fuel_stations.topojson'),
	Edmonton: require('./data/Edmonton/alt_fuel_stations.topojson'),
	Vancouver: require('./data/Vancouver/alt_fuel_stations.topojson')
}

export default function(props){
	const { city } = props
	const [ points, setPoints ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			setPoints( topo2geo(resp,'alt_fuel_stations').features )
		} )
	},[city])
	let pointFeatures = points.map( (feat,i) => {
		let ll = GeoJSON.coordsToLatLng(feat.geometry.coordinates)
		return ( 
			<CircleMarker key={`${feat.properties.type}/${city.name}/${i}`} 
				center={ll} radius={5}
				pathOptions={{'color':color(feat.properties.fuel_type_code)}}/>
		)
	} )
	return <LayerGroup>{pointFeatures}</LayerGroup>
}
