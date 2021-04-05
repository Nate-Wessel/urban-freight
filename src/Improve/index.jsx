import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, LayerGroup } from 'react-leaflet'
import { scaleOrdinal, scalePow } from 'd3-scale'
import { geojson2leaflet } from '../geojson2leaflet'

const keys = ['ELEC','CNG','LPG']
const color = scaleOrdinal()
	.domain(keys)
	.range(['##2bd76a','#ff2a7f','#5555ff'])

const data = {
	Toronto: require('../data/Toronto/alt_fuel_stations.topojson'),
	Edmonton: require('../data/Edmonton/alt_fuel_stations.topojson'),
	Vancouver: require('../data/Vancouver/alt_fuel_stations.topojson')
}

const pointRadius = scalePow()
	.exponent(2)
	.domain([10,16])
	.range([2,50])

const pointWeight = scalePow()
		.exponent(2)
		.domain([10,16])
		.range([1,3])


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
						<FuelingPoints
						key={key}
						color={color(key)}
						features={points.filter(f=>f.properties.fuel_type_code==key)}
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
