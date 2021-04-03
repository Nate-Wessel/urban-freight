import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, LayerGroup } from 'react-leaflet'
import { scaleOrdinal } from 'd3-scale'
import { geojson2leaflet } from '../geojson2leaflet'
import Transit from './Transit'
import ParkingTime from './ParkingTime'

const operators = ['Purol','Fedex','UPS','Penguin']

const color = scaleOrdinal()
	.domain(operators)
	.range(['red','green','blue','black'])

const data = {
	Toronto: require('../data/Toronto/pickup_pts.topojson'),
	Edmonton: require('../data/Edmonton/pickup_pts.topojson'),
	Vancouver: require('../data/Vancouver/pickup_pts.topojson')
}

export default function(props){
	const { city, zoom } = props
	const [ points, setPoints ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			setPoints( topo2geo(resp,'pickup_pts').features )
		} )
	},[city])
	return ( 
		<LayerGroup>
			{operators.map( operatorName => (
				<PickUpPoints key={operatorName}
					features={points.filter(f=>f.properties.type==operatorName)} 
					color={color(operatorName)}/>
			) )}
			<Transit city={city} zoom={zoom}/>
			<ParkingTime city={city}/>
		</LayerGroup>
	)
}

function PickUpPoints(props){
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
