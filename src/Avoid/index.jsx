import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'
import { Pane } from 'react-leaflet'
import { ParkingTime } from './ParkingTime'
import { PickupPoints, operators } from './PickupPoints'

export default function({city,zoom,displayed}){
	const [ fedex, setFedex ] = useState([])
	const [ purolator, setPurolator ] = useState([])
	const [ ups, setUps ] = useState([])
	const [ penguin, setPenguin ] = useState([])
	
	useEffect(()=>{
		// reset when city changes
		if( fedex.length > 0 ) setFedex([]);
		if( purolator.length > 0) setPurolator([]); 
		if( ups.length > 0 ) setUps([]); 
		if( penguin.length > 0) setPenguin([]);
		// check for data and fetch if it's to be got
		const PuP = city.data?.avoid?.pickupPoints
		if(!PuP){
			return console.warn(`pickup points not yet defined for ${city.name}`)
		}
		if(PuP?.purolator) json(PuP.purolator).then( resp => {
			setPurolator( topo2geo(resp,'pts_purolator').features )
		} );
		if(PuP.fedex) json(PuP.fedex).then( resp => {
			setFedex( topo2geo(resp,'pts_fedex').features )
		} );
		if(PuP.ups) json(PuP.ups).then( resp => {
			setUps( topo2geo(resp,'pts_ups').features )
		} );
		if(PuP.penguin) json(PuP.penguin).then( resp => {
			setPenguin( topo2geo(resp,'pts_penguin').features )
		} );
	},[city])
	const points = { Purol: purolator, Fedex: fedex, UPS: ups, Penguin: penguin }
	return (
		<>
			<Pane name="pick-up-locations" style={{zIndex:445}}>
				{operators.map( operatorKey => {
					if(displayed.has(operatorKey)){
						let features = points[operatorKey]
						return (
							<PickupPoints key={operatorKey}
								zoom={zoom}
								features={features}/>
						)
					}
				} ) }
			</Pane>
			<Pane name="parking-time" style={{zIndex:444}}>
				{displayed.has('parking') &&
					<ParkingTime city={city}/>
				}
			</Pane>
		</>
	)
}
