import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, GeoJSON } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scalePow } from 'd3-scale'

const sources = {
	Toronto: {
		DAs: require('./data/Toronto/da_polygons.topojson' ),
		boundary: require('./data/Toronto/csd_boundary.topojson')
	},
	Vancouver: {
		DAs: require('./data/Vancouver/da_polygons.topojson'),
		boundary: require('./data/Vancouver/csd_boundary.topojson')
	},
	Edmonton: {
		DAs: require('./data/Edmonton/da_polygons.topojson'),
		boundary: require('./data/Edmonton/csd_boundary.topojson')
	}
}

export default function(props){
	// not yet supported
	if(props.layer.name == 'Landuse'){ return null }
	return (
		<LayerGroup>
			<CityBoundary city={props.city}/>
			<DisseminationAreas city={props.city} layer={props.layer}/>
		</LayerGroup>
	)
}

function CityBoundary(props){
	const [ boundaryFeature, setBoundaryFeature ] = useState(null)
	useEffect(()=>{
		const cityData = sources[props.city.name]
		json(cityData.boundary).then( data => {
			setBoundaryFeature( topo2geo(data,'csd_boundary').features[0] )
		} )
	},[props.city])
	if( ! boundaryFeature ) return null;
	console.log(boundaryFeature)
	return (
		<GeoJSON id="city-boundary"
			data={boundaryFeature}
			pathOptions={ {color:'black',fill:false, weight: 1} }/>
	)
}

const empDensity = scalePow()
	.exponent(0.5)
	.domain([0,50000])
	.range(['white','#df9a31'])

const popDensity = scalePow()
	.exponent(0.5)
	.domain([0,20000])
	.range(['white','#df9a31'])

function DisseminationAreas(props){
	const [ DAs, setDAs ] = useState(null)
	useEffect(()=>{
		const cityData = sources[props.city.name]
		json(cityData.DAs).then( data => {
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
