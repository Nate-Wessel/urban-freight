import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, GeoJSON } from 'react-leaflet'
import { json } from 'd3-fetch'

const sources = {
	Toronto: {
		DAs: require('./data/Toronto/da_polygons.topojson' )
	},
	Vancouver: {
		DAs: require('./data/Vancouver/da_polygons.topojson')
	},
	Edmonton: {
		DAs: require('./data/Edmonton/da_polygons.topojson')
	}
}

export default function(props){
	const [ DAs, setDAs ] = useState({features:[]})
	useEffect(()=>{
		let src = sources[props.city.name].DAs
		json(src).then( data => {
			setDAs( topo2geo(data,'da_polygons') )
		} )
	},[props.city])
	return (
		<LayerGroup>{
			DAs.features.map( da => <GeoJSON key={da.properties.dauid} data={da}/> )
		}</LayerGroup>
	)
}
