import React, { useState, useEffect } from 'react'
import { CircleMarker, Tooltip } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scalePow } from 'd3-scale'

const data = {
	Toronto: 'https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information',
	Vancouver: require('../data/Vancouver/station_information.json')
}

// area ~= to capacity
const defaultRadius = scalePow().exponent(0.5).domain([1,50]).range([1,5])
const zoomFactor = scalePow().exponent(1).domain([10,16]).range([0.5,3])
export function radius(capacity,zoom){
	return defaultRadius(capacity) * zoomFactor(zoom)
}

export const style = {
	weight: 1,
	color: "white",
	fillColor: "#d64a00",
	opacity: 0.9,
	fillOpacity: 0.9,
	bubblingMouseEvents: false
}

export function BikeShare(props){
	const { city, zoom } = props
	const [ stations, setStations ] = useState([])
	useEffect(()=>{
		if(city.name in data){
			if(typeof data[city.name] == 'string'){
				json(data[city.name]).then(resp=>setStations(resp.data.stations))
			}else{
				setStations(data[city.name].data.stations)
			}
		}else{
			setStations([])
		}
	},[city])
	return stations.map( station => {
		return (
			<CircleMarker key={station.station_id}
				center={[station.lat,station.lon]}
				radius={radius(station.capacity,zoom)}
				pathOptions={style}>
				<Tooltip pane="tooltipPane">
					{`${station.name} - capacity: ${station.capacity}`}
				</Tooltip>
			</CircleMarker>
		)
	} )
}
