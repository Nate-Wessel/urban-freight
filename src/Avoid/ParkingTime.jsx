import React, { useState, useEffect } from 'react'
import { Polygon } from 'react-leaflet'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { density } from './density.js'
import { geojson2leaflet } from '../geojson2leaflet'

const data = {
	Toronto: require('../data/Toronto/ignition.topojson'),
	Edmonton: require('../data/Edmonton/ignition.topojson'),
	Vancouver: require('../data/Vancouver/ignition.topojson')
}

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
		color: '#d90000',
		fillOpacity: 0.09,
		fillColor: 'grey',
		opacity: 0.5,
		bubblingMouseEvents: false
	}
	return contours.map( cont => {
		return (
			<Polygon key={`${city}/${cont.value}`}
				positions={cont.leafletGeom}
				pathOptions={style}
				smoothFactor={0.5}/>
		)
	} )
}
