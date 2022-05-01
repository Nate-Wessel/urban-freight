import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { Pane } from 'react-leaflet'
import ParkingLots from './ParkingLots'
import { BikeShare } from './BikeShare'
import { color } from './routeStyles'

//types: [ "L", "P", "S", "T", "O" ]
const pathTypes = new Set(['P','O'])
const routeTypes = new Set(['S'])
const laneTypes = new Set(['L','T'])

export default function({city,displayed,zoom}){
	const [ bikePaths, setBikePaths ] = useState([])
	const [ bikeLanes, setBikeLanes ] = useState([])
	const [ bikeRoutes, setBikeRoutes ] = useState([])
	useEffect(()=>{
		import(`../data/${city.name}/shift/bike.topo.json`)
			.then( ({default:data}) => {
				let features = topo2geo(data,'bike').features
					.filter(feat=>feat.geometry) // necessary because one feature is null
				setBikePaths(features.filter(f=>pathTypes.has(f.properties.type)))
				setBikeLanes(features.filter(f=>laneTypes.has(f.properties.type)))
				setBikeRoutes(features.filter(f=>routeTypes.has(f.properties.type)))
			} )
			.catch( err => {
				setBikePaths([]); setBikeLanes([]); setBikeRoutes([])
				console.warn(`bike features not yet defined for ${city.name}`)
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
