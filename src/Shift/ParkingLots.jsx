import React, { useState, useEffect } from 'react'
import { Polygon } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scaleOrdinal, scalePow } from 'd3-scale'
import { feature as topo2geo } from 'topojson-client'
import { geojson2leaflet } from '../geojson2leaflet'

const data = {
	Toronto: require('../data/Toronto/lu_parking.topojson'),
	Edmonton: require('../data/Edmonton/lu_parking.topojson'),
	Vancouver: require('../data/Vancouver/lu_parking.topojson')
}


export const ownership = ['P','M']

export const color = scaleOrdinal()
	.domain(ownership)
	.range(['#a2a094','#4d4b40'])


export default function(props){
	const { city } = props
	const [ lots,setLots ] = useState([])
	let styleOptions = {
		stroke: false,
		fillOpacity: 1
	}
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			setLots( topo2geo(resp,'lu_parking').features )
		} )
	},[city])
	return lots.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		let clr = color(feat.properties.T)
		return <Polygon key={i} positions={ll}
		pathOptions={{...styleOptions,...{fillColor:clr}}}
		/>
	} )
}
