import React from 'react'
import PickupPoint from './PickupPoint'
import ChargingStation from './ChargingStation'
import BikeShare from './BikeShare'
import Transit from './Transit'
import ParkingLot from './ParkingLot'
import ParkingTime from './ParkingTime'

// keys should be unique across paradigms
const paradigms = {
	avoid:{
		layers:[
			{
				key: 'transit',
				label: 'Public Transit',
				icon: Transit
			},
			{
				key: 'parking',
				label: 'Parking Time',
				icon: ParkingTime
			},
			{
				key: 'Purol',
				label: 'Purolator',
				icon: PickupPoint
			},
			{
				key: 'Fedex',
				label: 'Fedex',
				icon: PickupPoint
			},
			{
				key: 'UPS',
				label: 'UPS',
				icon: PickupPoint
			},
			{
				key: 'Penguin',
				label: 'Penguin',
				icon: PickupPoint
			},

		]
	},
	shift:{
		layers:[
			{
				key:'bike-paths',
				label:'Bike Paths',
				description: 'Bike paths are fully separate from cars, though generally shared with pedestrians and other modes like skateboards.'
			},
			{
				key:'bike-lanes',
				label:'Bike Lanes',
				description: 'Bike lanes are bike-only infrastructure generally running parallel to other modes between a primarily automotive lane and the sidewalk.'
			},
			{
				key:'bike-routes',
				label:'Bike Routes',
				description: 'Bike "routes" include non-segregated infrastucture that is explicitly signed/designated for use by cyclists. E.g. "sharrows". '
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
				icon: ParkingLot
			}
		]
	},
	improve:{
		layers:[
			{
				key: 'ELEC',
				label: 'Electric',
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
				"<b>{paradigm.toUpperCase()}" data layers:</b> {city.name}
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
