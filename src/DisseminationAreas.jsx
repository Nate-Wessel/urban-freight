import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, GeoJSON } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scalePow } from 'd3-scale'

const sources = {
	Toronto: require('./data/Toronto/da_polygons.topojson' ),
	Vancouver: require('./data/Vancouver/da_polygons.topojson'),
	Edmonton: require('./data/Edmonton/da_polygons.topojson')
}

const empDensity = scalePow()
	.exponent(0.5)
	.domain([0,50000])
	.range(['white','#df9a31'])

const popDensity = scalePow()
	.exponent(0.5)
	.domain([0,20000])
	.range(['white','#df9a31'])

export default function(props){
	const [ DAs, setDAs ] = useState(null)
	useEffect(()=>{
		json(sources[props.city.name]).then( data => {
			setDAs( topo2geo(data,'da_polygons') )
		} )
	},[props.city])
	if ( !DAs ) return null;
	const [ fillFunc, fillProp ] = props.layer.name == 'Employment' ? 
		[ empDensity, 'density_employment' ] : 
		[ popDensity, 'density_population' ];
	const staticOptions = { 
		stroke:true, 
		color: "white", 
		weight:0.5, 
		fillOpacity:0.666, 
		opacity:0.666
	}
	return (
		<LayerGroup>{
			DAs.features.map( da => {
				let fill = { fillColor: fillFunc(da.properties[fillProp]) }
				return (
					<GeoJSON key={da.properties.dauid} data={da}
						pathOptions={ { ...staticOptions, ...fill } }/>
				)
			} )
		}</LayerGroup>
	)
}
