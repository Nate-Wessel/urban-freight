import React, { useState, useEffect } from 'react'
import { CircleMarker, Tooltip } from 'react-leaflet'
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
		setStations([]) // reset
		const bikeshare = city.data?.shift?.bikeShare
		if(typeof bikeshare == 'string'){
			fetch(bikeshare)
				.then( resp => resp.json() )
				.then( resp => setStations(resp.data.stations) )
		}else{
			import(`../data/${city.name}/shift/station_information.json`)
				.then( m => setStations(m.default.data.stations) )
				.catch( err => setStations([]) )
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
