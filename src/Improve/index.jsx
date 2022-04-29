import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { CircleMarker, Pane } from 'react-leaflet'
import { pointRadius, pointWeight, keys, color } from './scales.js'
import { geojson2leaflet } from '../geojson2leaflet'

export default function({city,zoom,displayed}){
	const [ points, setPoints ] = useState([])
	useEffect(()=>{
		import(`../data/${city.name}/improve/alt_fuel_stations.topojson`)
			.then( module => fetch(module.default) )
			.then( resp => resp.json() )
			.then( resp => setPoints( topo2geo(resp,'alt_fuel_stations').features ) )
			.catch( err => setPoints([]) )
	},[city])
	return (
		<Pane name="fuel-stuff" style={{zIndex:445}}>
			{keys.map(key=>{
				if(displayed.has(key)){
					return (
						<FuelingPoints key={key}
							color={color(key)}
							features={points.filter(f=>f.properties.type==key)}
							zoom={zoom}/>
					)
				}
			} ) }
		</Pane>
	)
}

function FuelingPoints(props){
	const { features, color, zoom } = props
	let styleOptions = {
		fillColor: color,
		opacity: 1,
		fillOpacity: 1,
		weight: pointWeight(zoom),
		color: 'white',
		bubblingMouseEvents: false
	}
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return (
			<CircleMarker key={`${feat.properties.type}/${i}`}
				center={ll} radius={pointRadius(zoom)}
				pathOptions={styleOptions}/>
		)
	} )
}
