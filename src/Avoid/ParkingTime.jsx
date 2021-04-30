import React, { useState, useEffect } from 'react'
import { Polygon, Tooltip } from 'react-leaflet'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { scaleOrdinal } from 'd3-scale'
import { density } from './density.js'
import { geojson2leaflet } from '../geojson2leaflet'

const data = {
	Toronto: require('../data/Toronto/ignition.topojson'),
	Edmonton: require('../data/Edmonton/ignition.topojson'),
	Vancouver: require('../data/Vancouver/ignition.topojson')
}

const color = scaleOrdinal()
	.domain([1,3,5])
	.range(['grey','blue','red'])

export default function({city}){
	const [ contours, setContours ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			let feats = topo2geo(resp,'ignition').features
			let conts = density(feats,city)
			conts.map( cont => cont.leafletGeom = geojson2leaflet(cont) )
			setContours( conts )
		} )
	},[city])
	const style = {
		weight: 1.5,
		color: '#d90000bb',
		fillOpacity: 0.09,
		opacity: 0.5,
		bubblingMouseEvents: false
	}
	return contours.map( cont => {
		return (
			<Polygon key={`${city}/${cont.value}`}
				positions={cont.leafletGeom}
				pathOptions={{...style,...{fillColor:color(cont.value)}}}
				smoothFactor={0}>
				<Tooltip pane="tooltipPane" sticky={true}>
					{`${cont.value}-${cont.value+2} minutes average time to find parking`}
				</Tooltip>
			</Polygon>
		)
	} )
}
