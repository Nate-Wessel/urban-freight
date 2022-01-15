import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { Polygon } from 'react-leaflet'
import { geojson2leaflet } from '../geojson2leaflet'
import { json } from 'd3-fetch'

const sources = {
	Toronto: require('../data/Toronto/boundary.topojson'),
	Vancouver: require('../data/Vancouver/boundary.topojson'),
	Edmonton: require('../data/Edmonton/boundary.topojson'),
	Ottawa: require('../data/Ottawa/boundary.topojson')
}

const style = {
	color: '#0005', 
	fill: false, 
	weight: 1.5, 
	dashArray: '5 10 5'
}

export default function({city}){
	const [ boundaryFeature, setBoundaryFeature ] = useState(null)
	useEffect(()=>{
		json(sources[city.name]).then( data => {
			setBoundaryFeature( topo2geo(data,'boundary').features[0] )
		} )
	},[city])
	if( ! boundaryFeature ) return null;
	let latLngs = geojson2leaflet(boundaryFeature.geometry)
	return <Polygon id="city-boundary" positions={latLngs} pathOptions={style}/>
}
