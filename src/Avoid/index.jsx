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
		import(`../data/${city.name}/avoid/pts_purolator.topojson`)
			.then( module => json(module.default) )
			.then( data => setPurolator( topo2geo(data,'pts_purolator').features ) )
			.catch( err => setPurolator([]) )
		import(`../data/${city.name}/avoid/pts_fedex.topojson`)
			.then( module => json(module.default) )
			.then( data => setFedex( topo2geo(data,'pts_fedex').features ) )
			.catch( err => setFedex([]) )
		import(`../data/${city.name}/avoid/pts_penguin.topojson`)
			.then( module => json(module.default) )
			.then( data => setPenguin( topo2geo(data,'pts_penguin').features ) )
			.catch( err => setPenguin([]) )
		import(`../data/${city.name}/avoid/pts_ups.topojson`)
			.then( module => json(module.default) )
			.then( data => setUps( topo2geo(data,'pts_ups').features ) )
			.catch( err => setUps([]) )
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
