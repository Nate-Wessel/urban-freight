import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, LayerGroup } from 'react-leaflet'
import { geojson2leaflet } from '../geojson2leaflet'
import { scaleOrdinal } from 'd3-scale'

const keys = ['ELEC','CNG','LPG']
const color = scaleOrdinal()
	.domain(keys)
	.range(['red','green','blue'])

const data = {
	Toronto: require('../data/Toronto/alt_fuel_stations.topojson'),
	Edmonton: require('../data/Edmonton/alt_fuel_stations.topojson'),
	Vancouver: require('../data/Vancouver/alt_fuel_stations.topojson')
}

export default function(props){
	const { city, displayed } = props
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
						<FuelingPoints key={key} color={color(key)}
							features={points.filter(f=>f.properties.fuel_type_code==key)}/>
					)
				}
			} ) }
		</LayerGroup>
	)
}

function FuelingPoints(props){
	const { features, color } = props
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return ( 
			<CircleMarker key={`${feat.properties.type}/${i}`} 
				center={ll} radius={4}
				pathOptions={{'color':color,weight:1}}/>
		)
	} )
}
