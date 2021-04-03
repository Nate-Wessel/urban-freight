import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, LayerGroup } from 'react-leaflet'
import { scaleOrdinal } from 'd3-scale'
import { geojson2leaflet } from '../geojson2leaflet'
import Transit from './Transit'
import ParkingTime from './ParkingTime'

const color = scaleOrdinal()
	.domain(['Purol','Fedex','UPS','Penguin'])
	.range(['red','green','blue','black'])

const data = {
	Toronto: require('../data/Toronto/pickup_pts.topojson'),
	Edmonton: require('../data/Edmonton/pickup_pts.topojson'),
	Vancouver: require('../data/Vancouver/pickup_pts.topojson')
}

export default function(props){
	const { city } = props
	const [ points, setPoints ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			setPoints( topo2geo(resp,'pickup_pts').features )
		} )
	},[city])
	let pickupFeatures = points.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return ( 
			<CircleMarker key={`${feat.properties.type}/${city.name}/${i}`} 
				center={ll} radius={5}
				pathOptions={{'color':color(feat.properties.type)}}/>
		)
	} )
	return ( 
		<LayerGroup>
			{pickupFeatures}
			<Transit city={city}/>
			<ParkingTime city={city}/>
		</LayerGroup>
	)
}
