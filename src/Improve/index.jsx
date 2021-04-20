import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, LayerGroup } from 'react-leaflet'
import { pointRadius, pointWeight, keys, color } from './scales.js'
import { geojson2leaflet } from '../geojson2leaflet'

const data = {
	Toronto: require('../data/Toronto/alt_fuel_stations.topojson'),
	Edmonton: require('../data/Edmonton/alt_fuel_stations.topojson'),
	Vancouver: require('../data/Vancouver/alt_fuel_stations.topojson')
}

export default function(props){
	const { city, zoom, displayed } = props
	const [ points, setPoints ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			setPoints( topo2geo(resp,'alt_fuel_stations').features )
		} )
	},[city])
	return (
		<LayerGroup>
			{keys.map(key=>{
				if(displayed.has(key)){
					return (
						<FuelingPoints key={key}
							color={color(key)}
							features={points.filter(f=>f.properties.type==key)}
							zoom={zoom}/>
					)
				}
			} ) }
		</LayerGroup>
	)
}

function FuelingPoints(props){
	const { features, color, zoom } = props
	let styleOptions = {
		fillColor: color,
		opacity: 1,
		fillOpacity: 1,
		weight: pointWeight(zoom),
		color: 'white'
	}
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return (
			<CircleMarker key={`${feat.properties.type}/${i}`}
				center={ll} radius={pointRadius(zoom)}
				pathOptions={styleOptions}/>
		)
	} )
}
