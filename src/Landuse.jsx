import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, Polygon } from 'react-leaflet'
import { GeoJSON } from 'leaflet'
import { json } from 'd3-fetch'

const sources = {
	Toronto: {
		green: require('./data/Toronto/lu_green.topojson' ),
		industrial: require('./data/Toronto/lu_industrial.topojson' ),
		parking: require('./data/Toronto/lu_parking.topojson' ),
		retail: require('./data/Toronto/lu_retail.topojson' )
	},
	Vancouver: {
		green: require('./data/Vancouver/lu_green.topojson' ),
		industrial: require('./data/Vancouver/lu_industrial.topojson' ),
		parking: require('./data/Vancouver/lu_parking.topojson' ),
		retail: require('./data/Vancouver/lu_retail.topojson' )
	},
	Edmonton: {
		green: require('./data/Edmonton/lu_green.topojson' ),
		industrial: require('./data/Edmonton/lu_industrial.topojson' ),
		parking: require('./data/Edmonton/lu_parking.topojson' ),
		retail: require('./data/Edmonton/lu_retail.topojson' )
	}
}

export default function(props){
	const { city } = props
	const [ green, setGreen ] = useState([])
	const [ parking, setParking ] = useState([])
	useEffect(()=>{
		json(sources[city.name].green).then( data => {
			setGreen( topo2geo(data,'lu_green').features )
		} )
		json(sources[city.name].parking).then( data => {
			setParking( topo2geo(data,'lu_parking').features )
		} )
	},[city])
	const greenFeatures = green.map( (feature,i) => {
		let latLngs = GeoJSON.coordsToLatLngs(feature.geometry.coordinates,2)
		return <Polygon key={`${city.name}/green/${i}`} positions={latLngs}/>
	} )
	const parkingFeatures = parking.map( (feature,i) => {
		let latLngs = GeoJSON.coordsToLatLngs(feature.geometry.coordinates,1)
		return <Polygon key={`${city.name}/parking/${i}`} positions={latLngs}/>
	} )
	return (
		<LayerGroup>
			{greenFeatures}
			{parkingFeatures}
		</LayerGroup>
	)
}
