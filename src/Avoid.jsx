import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, LayerGroup } from 'react-leaflet'
import { GeoJSON } from 'leaflet'

const data = {
	Toronto: require('./data/Toronto/fedex.topojson'),
	Edmonton: require('./data/Edmonton/fedex.topojson'),
	Vancouver: require('./data/Vancouver/fedex.topojson')
}

export default function(props){
	const { city } = props
	const [ points, setPoints ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( d => {
			setPoints( topo2geo(d,'fedex').features ) 
		} )
	},[city])
	let pointFeatures = points.map( (feat,i) => {
		let ll = GeoJSON.coordsToLatLng(feat.geometry.coordinates)
		return ( 
			<CircleMarker key={`fedex/${city.name}/${i}`} 
				center={ll} 
				pathOptions={{color:'red'}}/>
		)
	} )
	return <LayerGroup>{pointFeatures}</LayerGroup>
}
