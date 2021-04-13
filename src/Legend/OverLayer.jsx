import React from 'react'
import PickupPoint from './PickupPoint'
import ChargingStation from './ChargingStation'
import BikeShare from './BikeShare'

// keys should be unique across paradigms
const paradigms = {
	avoid:{
		layers:[
			{
				key: 'transit',
				label: 'Public Transit'
			},
			{
				key: 'parking',
				label: 'Parking Time'
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
				label:'Bike Paths'
			},
			{
				key:'bike-lanes',
				label:'Bike Lanes'
			},
			{
				key:'bike-routes',
				label:'Bike Routes'
			},
			{
				key:'bike-share',
				label:'Bike-share Stations',
				icon: BikeShare
			},
			{
				key:'parking-lots',
				label:'Parking Lots'
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
		<div
			className={`item clickable ${active ? 'active' : 'disabled'}`}
			onClick={(e)=>handleClick(layer.key)}>
			<span className="icon">{icon}</span>
			<span className="label">{layer.label}</span>
		</div>
	)
}
