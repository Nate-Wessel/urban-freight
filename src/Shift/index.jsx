import React, { useState, useEffect } from 'react'
import { LayerGroup } from 'react-leaflet'
import ParkingLots from './ParkingLots'
import BikeShare from './BikeShare'

export default function(props){
	const { city, displayed } = props
	
	return (
		<LayerGroup>
			{displayed.has('parking-lots') && <ParkingLots city={city}/>}
			{displayed.has('bike-share') && <BikeShare city={city}/>}
		</LayerGroup>
	)
}
