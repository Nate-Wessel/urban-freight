import React from 'react'
import { CircleSvg } from './Circle.jsx'

// keys should be unique across paradigms
const paradigms = {
	avoid:{
		layers:[
			{
				key: 'Purol',
				label: 'Purolator',
				type: 'circle'
			},
			{
				key: 'Fedex',
				label: 'Fedex',
				type: 'circle'
			},
			{
				key: 'UPS',
				label: 'UPS',
				type: 'circle'
			},
			{
				key: 'Penguin',
				label: 'Penguin',
				type: 'circle'
			},
			{
				key: 'transit',
				label: 'Public Transit',
				type: 'img'
			},
			{
				key: 'parking',
				label: 'Parking Time',
				type: 'img'
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
				label:'Bike-share Stations'
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
				label: 'Electric'
			},
			{
				key: 'CNG',
				label: 'Compressed Natural Gas'
			},
			{
				key: 'LPG',
				label: 'Propane'
			}
		]
	}
}

export default function(props){
	const { paradigm, zoom, displayed, setDisplayed } = props
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
			<span className="title">Data Layers</span>
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


import { color, pointRadius, pointWeight } from '../Avoid/PickupPoints'

function Item(props){
	const { layer, active, handleClick, zoom } = props
	let icon = null
	if(layer.type == 'circle'){
		icon = (
			<CircleSvg 
				color={color(layer.key)} 
				radius={pointRadius(zoom)}
				strokeWidth={pointWeight(zoom)}/>
		)
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
