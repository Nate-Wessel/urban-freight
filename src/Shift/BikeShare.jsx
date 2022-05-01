import React, { useState, useEffect } from 'react'
import { CircleMarker, Tooltip } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scalePow } from 'd3-scale'

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

export function BikeShare({city,zoom}){
	const [ stations, setStations ] = useState([])
	useEffect(()=>{
		const bikeshare = city.data?.shift?.bikeShare
		if(!bikeshare) return setStations([]);
		if(typeof bikeshare == 'string'){
			json(bikeshare).then( response => setStations(response.data.stations) )
		}else{
			setStations(bikeshare.data.stations)
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
