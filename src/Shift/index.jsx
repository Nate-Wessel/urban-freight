import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup } from 'react-leaflet'
import ParkingLots from './ParkingLots'
import BikeShare from './BikeShare'

const data = {
	Toronto: require('../data/Toronto/bike.topojson'),
	Edmonton: require('../data/Edmonton/bike.topojson'),
	Vancouver: require('../data/Vancouver/bike.topojson')
}

export default function(props){
	const { city, displayed } = props
	const [ bikePaths, setBikePaths ] = useState([])
	const [ bikeLanes, setBikeLanes ] = useState([])
	const [ bikeRoutes, setBikeRoutes ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			let features = topo2geo(resp,'bike').features
			//TODO handle types: [ "L", "P", "S", "T", "O" ]
			setBikePaths(features.filter(f=>f.properties.type=='P'))
			setBikeLanes(features.filter(f=>f.properties.type=='L'))
			setBikeRoutes(features.filter(f=>f.properties.type=='S'))
		} )
	},[city])
	return (
		<LayerGroup>
			{displayed.has('bike-paths') && <BikePaths features={bikePaths}/>}
			{displayed.has('bike-lanes') && <BikeLanes features={bikeLanes}/>}
			{displayed.has('bike-routes') && <BikeRoutes features={bikeRoutes}/>}
			{displayed.has('parking-lots') && <ParkingLots city={city}/>}
			{displayed.has('bike-share') && <BikeShare city={city}/>}
		</LayerGroup>
	)
}

import { Polyline } from 'react-leaflet'
import { geojson2leaflet } from '../geojson2leaflet'

const basicStyle = { weight: 1, color: 'grey' }

function BikePaths(props){
	const { features } = props
	const style = {...basicStyle,...{color:'green'}}
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return <Polyline key={`path/${i}`} positions={ll} pathOptions={style}/>
	} )
}

function BikeLanes(props){
	const { features } = props
	const style = {...basicStyle,...{color:'blue'}}
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return <Polyline key={`lane/${i}`} positions={ll} pathOptions={style}/>
	} )
}

function BikeRoutes(props){
	const { features } = props
	const style = basicStyle
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		return <Polyline key={`route/${i}`} positions={ll}pathOptions={style}/>
	} )
}
