import React from 'react'

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
				label: 'img'
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
					let activeStatus = displayed.has(l.key) ? 'active' : 'disabled'
					return (
						<div key={l.key}
							className={`item clickable ${activeStatus}`}
							onClick={(e)=>handleClick(l.key)}>
							<span className="icon">
							</span>
							<span className="label">{l.label}</span>
						</div>
					)
				})
			}</div>
		</div>
	)
}
