import React, { useState, useEffect } from 'react'
import { Polygon } from 'react-leaflet'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { geojson2leaflet } from '../geojson2leaflet'

const data = {
	Toronto: require('../data/Toronto/lu_parking.topojson'),
	Edmonton: require('../data/Edmonton/lu_parking.topojson'),
	Vancouver: require('../data/Vancouver/lu_parking.topojson')
}

const style = {
	stroke: false,
	fillColor:'#a2a094',
	fillOpacity: 1
}

export default function(props){
	const { city } = props
	const [ lots,setLots ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			setLots( topo2geo(resp,'lu_parking').features )
		} )
	},[city])
	return lots.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return <Polygon key={i} positions={ll} pathOptions={style}/>
	} )
}
