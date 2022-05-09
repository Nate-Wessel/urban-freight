import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, GeoJSON } from 'react-leaflet'
import { scalePow, scaleThreshold } from 'd3-scale'

export const empDensity = scaleThreshold()
    .domain([1000, 5000, 10000, 20000])
    .range(['#eee9f0','#e3dbe6','#ccbed3','#b6a1bf','#a58bb1'])

export const popDensity = scaleThreshold()
    .domain([1000, 5000, 10000, 20000])
    .range(['#fef3e1','#feeccf','#fee5be','#fedeab','#fccd80'])

export function DisseminationAreas({city,layer}){
	const [ DAs, setDAs ] = useState(null)
	useEffect(()=>{
		import(`../data/${city.name}/da_polygons.topojson`)
			.then( ({default:data}) => setDAs(topo2geo(data,'da_polygons')) )
			.catch( err => setDAs(null) )
	},[city])
	if ( !DAs ) return null;
	const [ fillFunc, fillProp ] = layer.name == 'Employment' ?
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
