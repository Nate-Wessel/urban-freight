import React from 'react'
import PickupPoint from './PickupPoint'
import ChargingStation from './ChargingStation'
import BikeShare from './BikeShare'
import ParkingLot from './ParkingLot'
import ParkingTime from './ParkingTime'
import { routeIcon } from '../Shift/routeStyles'

// keys should be unique across paradigms
const paradigms = {
	avoid:{
		layers:[
			{
				key: 'parking',
				label: 'Parking Time',
				icon: ParkingTime,
				description: 'Average time trucks spend looking for parking. Hover to see the estimated time in minutes.'
			},
			{
				key: 'Purol',
				label: 'Purolator',
				icon: PickupPoint,
				description: 'Includes parcel pick up and shipping locations. Hover over a point for details.'
			},
			{
				key: 'Fedex',
				label: 'Fedex',
				icon: PickupPoint,
				description: 'Includes parcel pick up and shipping locations.'
			},
			{
				key: 'UPS',
				label: 'UPS',
				icon: PickupPoint,
				description: 'UPS Store locations.'
			},
			{
				key: 'Penguin',
				label: 'Penguin',
				icon: PickupPoint,
				description: 'PenguinPickUp retail locations.'
			}


		]
	},
	shift:{
		layers:[
			{
				key:'bike-paths',
				label:'Bike Paths',
				icon: routeIcon,
				description: 'Bike paths are fully separate from cars, though generally shared with pedestrians and other modes like skateboards.'

			},
			{
				key:'bike-lanes',
				label:'Bike Lanes',
				icon: routeIcon,
				description: 'Bike lanes are bike-only infrastructure generally running parallel to other modes between a primarily automotive lane and the sidewalk.'
			},
			{
				key:'bike-routes',
				label:'Bike Routes',
				icon: routeIcon,
				description: 'Bike "routes" include non-segregated infrastucture that is explicitly signed/designated for use by cyclists. E.g. "sharrows".'
			},
			{
				key:'bike-share',
				label:'Bike-share Stations',
				icon: BikeShare,
				description: "Hover over a bikeshare station to see its name and designated capacity"
			},
			{
				key:'parking-lots',
				label:'Parking Lots',
				icon: ParkingLot,
				description: "Surface parking lots. Darker colour indicates municipally operated"
			}
		]
	},
	improve:{
		layers:[
			{
				key: 'E1',
				label: 'Electric (E1)',
				icon: ChargingStation
			},
			{
				key: 'E2',
				label: 'Electric (E2)',
				icon: ChargingStation
			},
			{
				key: 'E3',
				label: 'Electric (E3/DC)',
				icon: ChargingStation
			},
			{
				key: 'CNG',
				label: 'Compressed Natural Gas',
				icon: ChargingStation
			},
			{
				key: 'LPG',
				label: 'Propane',
				icon: ChargingStation
			}
		]
	}
}

export default function(props){
	const { paradigm, city, zoom, displayed, setDisplayed } = props
	function handleClick(key){
		if(displayed.has(key)){
			let update = new Set([...displayed])
			update.delete(key)
			setDisplayed(update)
		}else{
			let update = new Set([...displayed,key])
			setDisplayed(update)
		}
	}
	return (
		<div id="overlayer" className="layer">
			<span className="title">
				"{paradigm.toUpperCase()}" data layers: {city.name}
			</span>
			<div className="items">{
				paradigms[paradigm].layers.map(l=>{
					return (
						<Item key={l.key} layer={l} zoom={zoom}
							active={displayed.has(l.key)}
							handleClick={handleClick}/>
					)
				})
			}</div>
		</div>
	)
}

function Item(props){
	const { layer, active, handleClick, zoom } = props
	let icon = null
	if(layer.icon){
		icon = <layer.icon layerKey={layer.key} zoom={zoom}/>
	}
	return (
		<div onClick={(e)=>handleClick(layer.key)}
			title={layer.description}
			className={`item clickable ${active ? 'active' : 'disabled'}`}>
			<span className="icon">{icon}</span>
			<span className="label">{layer.label}</span>
		</div>
	)
}
