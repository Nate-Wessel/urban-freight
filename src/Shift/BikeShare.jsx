import React, { useState, useEffect } from 'react'
import { CircleMarker, Tooltip } from 'react-leaflet'
import { json } from 'd3-fetch'
import { scalePow } from 'd3-scale'

const data = {
	Toronto: 'https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information',
	Vancouver: require('../data/Vancouver/station_information.json')
}

// area ~= to capacity
const radius = scalePow().exponent(0.5).domain([1,50]).range([1,5])

export default function(props){
	const { city } = props
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
				radius={radius(station.capacity)}
				pathOptions={{weight:1, color:"#008753", opacity: 0.8, fillOpacity: 0.3}}>
				<Tooltip>
					{`${station.name} - capacity: ${station.capacity}`}
				</Tooltip>
			</CircleMarker>
		)
	} )
}
