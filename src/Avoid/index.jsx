import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup } from 'react-leaflet'
import Transit from './Transit'
import ParkingTime from './ParkingTime'
import { PickupPoints, operators } from './PickupPoints'

const data = {
	Toronto: require('../data/Toronto/pickup_pts.topojson'),
	Edmonton: require('../data/Edmonton/pickup_pts.topojson'),
	Vancouver: require('../data/Vancouver/pickup_pts.topojson')
}

export default function(props){
	const { city, zoom, displayed } = props
	const [ points, setPoints ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			setPoints( topo2geo(resp,'pickup_pts').features )
		} )
	},[city])
	return (
		<LayerGroup>
			{operators.map( operatorKey => {
				if(displayed.has(operatorKey)){
					let features = points.filter(f=>f.properties.type==operatorKey)
					return (
						<PickupPoints key={operatorKey}
							zoom={zoom}
							features={features}/>
					)
				}
			} ) }
			{displayed.has('transit') &&
				<Transit city={city} zoom={zoom}/>
			}
			{displayed.has('parking') &&
				<ParkingTime city={city}/>
			}
		</LayerGroup>
	)
}
