import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, GeoJSON } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scalePow, scaleThreshold } from 'd3-scale'

const sources = {
	Toronto: require('../data/Toronto/da_polygons.topojson' ),
	Vancouver: require('../data/Vancouver/da_polygons.topojson'),
	Edmonton: require('../data/Edmonton/da_polygons.topojson')
}

export const empDensity = scaleThreshold()
    .domain([1000, 5000, 10000, 20000])
    .range(['#eee9f0','#e3dbe6','#ccbed3','#b6a1bf','#a58bb1'])

export const popDensity = scaleThreshold()
    .domain([1000, 5000, 10000, 20000])
    .range(['#fef3e1','#feeccf','#fee5be','#fedeab','#fccd80'])

// ['#eff9f6','#e7f6f2','#d4eeef','#c1e6dd','#aedfd3']


export function DisseminationAreas(props){
	const [ DAs, setDAs ] = useState(null)
	useEffect(()=>{
		json(sources[props.city.name]).then( data => {
			setDAs( topo2geo(data,'da_polygons') )
		} )
	},[props.city])
	if ( !DAs ) return null;
	const [ fillFunc, fillProp ] = props.layer.name == 'Employment' ?
		[ empDensity, 'de' ] :
		[ popDensity, 'dp' ];
	const staticOptions = {
		stroke:true,
		color: "white",
		weight:0.5,
		fillOpacity:0.8,
		opacity:0.8
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
