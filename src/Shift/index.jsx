import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { Pane } from 'react-leaflet'
import ParkingLots from './ParkingLots'
import { BikeShare } from './BikeShare'
import { color } from './routeStyles'

const data = {
	Toronto: require('../data/Toronto/bike.topojson'),
	Edmonton: require('../data/Edmonton/bike.topojson'),
	Vancouver: require('../data/Vancouver/bike.topojson')
}

export default function(props){
	const { city, displayed, zoom } = props
	const [ bikePaths, setBikePaths ] = useState([])
	const [ bikeLanes, setBikeLanes ] = useState([])
	const [ bikeRoutes, setBikeRoutes ] = useState([])
	useEffect(()=>{
		//types: [ "L", "P", "S", "T", "O" ]
		let pathTypes = new Set(['P','O'])
		let routeTypes = new Set(['S'])
		let laneTypes = new Set(['L','T'])
		json(data[city.name]).then( resp => {
			let features = topo2geo(resp,'bike').features
				.filter(feat=>feat.geometry) // necessary because one feature is null
			setBikePaths(features.filter(f=>pathTypes.has(f.properties.type)))
			setBikeLanes(features.filter(f=>laneTypes.has(f.properties.type)))
			setBikeRoutes(features.filter(f=>routeTypes.has(f.properties.type)))
		} )
	},[city])
	return (
		<>
			<Pane name="bike-stuff" style={{zIndex:445}}>
				{displayed.has('bike-paths') && <BikePaths features={bikePaths}/>}
				{displayed.has('bike-lanes') && <BikeLanes features={bikeLanes}/>}
				{displayed.has('bike-routes') && <BikeRoutes features={bikeRoutes}/>}
			</Pane>
			<Pane name="parking-lots" style={{zIndex:441}}>
				{displayed.has('parking-lots') && <ParkingLots city={city}/>}
			</Pane>
			<Pane name="bike-share" style={{zIndex:449}}>
				{displayed.has('bike-share') && <BikeShare city={city} zoom={zoom}/>}
			</Pane>
		</>
	)
}

import { Polyline } from 'react-leaflet'
import { geojson2leaflet } from '../geojson2leaflet'

const basicStyle = { weight: 2, bubblingMouseEvents: false }

function BikePaths(props){
	const { features } = props
	const style = {...basicStyle,...{'color':color('bike-paths')}}
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return <Polyline key={`path/${i}`} positions={ll} pathOptions={style}/>
	} )
}

function BikeLanes(props){
	const { features } = props
	const style = {...basicStyle,...{'color':color('bike-lanes')}}
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return <Polyline key={`lane/${i}`} positions={ll} pathOptions={style}/>
	} )
}

function BikeRoutes(props){
	const { features } = props
	const style = {...basicStyle,...{'color':color('bike-routes')}}
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return <Polyline key={`route/${i}`} positions={ll}pathOptions={style}/>
	} )
}
