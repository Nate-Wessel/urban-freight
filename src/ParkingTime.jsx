import React, { useState, useEffect } from 'react'
import { Polygon, LayerGroup } from 'react-leaflet'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { density } from './density.js'
import { geojson2leaflet } from './geojson2leaflet'

const data = {
	Toronto: require('./data/Toronto/ignition.topojson'),
	Edmonton: require('./data/Edmonton/ignition.topojson'),
	Vancouver: require('./data/Vancouver/ignition.topojson')
}

export default function(props){
	const { city } = props
	const [ contours, setContours ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			let feats = topo2geo(resp,'ignition').features
			setContours( density(feats,city) )
		} )
	},[city])
	let contourFeatures = contours.map( cont => {
		let ll = geojson2leaflet(cont)
		return <Polygon key={`${city}/${cont.value}`} positions={ll}/>
	} )
	return ( 
		<LayerGroup>
			{contourFeatures}
		</LayerGroup>
	)
}

