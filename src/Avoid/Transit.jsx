import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, LayerGroup, Polyline } from 'react-leaflet'
import { geojson2leaflet } from '../geojson2leaflet'
import { scalePow } from 'd3-scale'

const data = {
	Toronto: {
		lines: require('../data/Toronto/transit_lines.topojson'),
		stops: require('../data/Toronto/transit_stops.topojson'),
	},
	Edmonton: {
		lines: require('../data/Edmonton/transit_lines.topojson'),
		stops: require('../data/Edmonton/transit_stops.topojson'),
	},
	Vancouver: {
		lines: require('../data/Vancouver/transit_lines.topojson'),
		stops: require('../data/Vancouver/transit_stops.topojson'),
	}
}

// function of zoom
const stopRadius = scalePow()
	.exponent(2)
	.domain([10,16])
	.range([2,10])

const lineStyle = {color:'darkgrey',weight:2}
const stopStyle = {color:'darkgrey',weight:2,fillColor:'white',fillOpacity:0.8}

export default function(props){
	const { city, zoom } = props
	const [ lines, setLines ] = useState([])
	const [ stops, setStops ] = useState([])
	useEffect(()=>{
		json(data[city.name].stops).then( resp => {
			setStops( topo2geo(resp,'transit_stops').features )
		} )
		json(data[city.name].lines).then( resp => {
			setLines( topo2geo(resp,'transit_lines').features )
		} )
	},[city])
	let stopFeatures = stops.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return (
			<CircleMarker key={i} center={ll} 
				radius={stopRadius(zoom)} pathOptions={stopStyle}/>
		)
	} )
	let lineFeatures = lines.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return <Polyline key={i} positions={ll} pathOptions={lineStyle}/>
	} )
	return ( 
		<LayerGroup>
			{stopFeatures}
			{lineFeatures}
		</LayerGroup>
	)
}

