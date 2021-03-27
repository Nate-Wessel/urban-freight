import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { GeoJSON } from 'react-leaflet'
import { json } from 'd3-fetch'

const sources = {
	Toronto: require('./data/Toronto/csd_boundary.topojson'),
	Vancouver: require('./data/Vancouver/csd_boundary.topojson'),
	Edmonton: require('./data/Edmonton/csd_boundary.topojson')
}

export default function(props){
	const [ boundaryFeature, setBoundaryFeature ] = useState(null)
	useEffect(()=>{
		json(sources[props.city.name]).then( data => {
			setBoundaryFeature( topo2geo(data,'csd_boundary').features[0] )
		} )
	},[props.city])
	if( ! boundaryFeature ) return null;
	return (
		<GeoJSON id="city-boundary"
			data={boundaryFeature}
			pathOptions={ {color:'black', fill:false, weight: 1} }/>
	)
}
