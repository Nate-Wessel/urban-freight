import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, GeoJSON } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scalePow } from 'd3-scale'

const empDensity = scalePow()
	.exponent(0.6)
	.domain([0,10000])
	.range(['rgba(0,0,0,0)','red'])
	
const popDensity = scalePow()
	.exponent(0.6)
	.domain([0,10000])
	.range(['rgba(0,0,0,0)','red'])

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
	if(props.layer.name == 'Landuse'){ return null }
	
	const [ DAs, setDAs ] = useState({features:[]})
	useEffect(()=>{
		let src = sources[props.city.name].DAs
		json(src).then( data => {
			setDAs( topo2geo(data,'da_polygons') )
		} )
	},[props.city])
	return (
		<LayerGroup>{
			DAs.features.map( da => {
				let fill
				if(props.layer.name == 'Employment'){
					fill = empDensity(da.properties.density_employment)
				}else{
					fill = popDensity(da.properties.density_population)
				}			
				return (
					<GeoJSON key={da.properties.dauid} 
						data={da}
						pathOptions={ {stroke:false, fillColor: fill} }/> 
				)
			} )
		}</LayerGroup>
	)
}
