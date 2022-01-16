import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { Polygon } from 'react-leaflet'
import { geojson2leaflet } from '../geojson2leaflet'
import { json } from 'd3-fetch'

const style = {
	color: '#0005', 
	fill: false, 
	weight: 1.5, 
	dashArray: '5 10 5'
}

export default function({city}){
	const [ boundaryFeature, setBoundaryFeature ] = useState(null)
	useEffect(()=>{
		if(!city.data?.base?.boundary){
			setBoundaryFeature(null)
			return console.warn(`boundary not yet defined for ${city.name}`)
		}
		json(city.data.base.boundary).then( data => {
			setBoundaryFeature( topo2geo(data,'boundary').features[0] )
		} )
	},[city])
	if( ! boundaryFeature ) return null;
	let latLngs = geojson2leaflet(boundaryFeature.geometry)
	return <Polygon id="city-boundary" positions={latLngs} pathOptions={style}/>
}
