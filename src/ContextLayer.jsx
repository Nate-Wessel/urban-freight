import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, GeoJSON } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scalePow } from 'd3-scale'

const empDensity = scalePow()
	.exponent(0.5)
	.domain([0,50000])
	.range(['white','#df9a31'])

const popDensity = scalePow()
	.exponent(0.5)
	.domain([0,20000])
	.range(['white','#df9a31'])

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
	if(props.layer.name == 'Landuse'){ return null }
	const [ boundary, setBoundary ] = useState(null)
	const [ DAs, setDAs ] = useState({features:[]})
	useEffect(()=>{
		const cityData = sources[props.city.name]
		json(cityData.DAs).then( data => {
			setDAs( topo2geo(data,'da_polygons') )
		} )
		json(cityData.boundary).then( data => {
			setBoundary( topo2geo(data,'csd_boundary').features[0] )
		} )
	},[props.city])
	return (
		<LayerGroup>
			{ boundary &&
				<GeoJSON id="city-boundary"
					data={boundary}
					pathOptions={ {color:'black',fill:false, weight: 1} }/>
			}
				{
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
								pathOptions={ {stroke:true, fillColor: fill, color: "white", weight:0.5, fillOpacity:0.666, opacity:0.666} }/>
						)
					} )
				}
		</LayerGroup>
	)
}
