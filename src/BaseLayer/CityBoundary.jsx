import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { Polygon } from 'react-leaflet'
import { geojson2leaflet } from '../geojson2leaflet'
import { json } from 'd3-fetch'

const sources = {
	Toronto: require('../data/Toronto/csd_boundary.topojson'),
	Vancouver: require('../data/Vancouver/csd_boundary.topojson'),
	Edmonton: require('../data/Edmonton/csd_boundary.topojson')
}

export default function(props){
	const [ boundaryFeature, setBoundaryFeature ] = useState(null)
	useEffect(()=>{
		json(sources[props.city.name]).then( data => {
			setBoundaryFeature( topo2geo(data,'csd_boundary').features[0] )
		} )
	},[props.city])
	if( ! boundaryFeature ) return null;
	let latLngs = geojson2leaflet(boundaryFeature.geometry)
	return (
		<Polygon id="city-boundary"
			positions={latLngs}
			pathOptions={ {color:'black', fill:false, weight: 1} }/>
	)
}
