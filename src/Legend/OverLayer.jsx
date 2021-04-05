import React from 'react'

// keys should be unique across paradigms
const paradigms = {
	avoid:{
		layers:[
			{
				key: 'Purol',
				label: 'Purolator'
			},
			{
				key: 'Fedex',
				label: 'Fedex'
			},
			{
				key: 'UPS',
				label: 'UPS'
			},
			{
				key: 'Penguin',
				label: 'Penguin'
			},
			{
				key: 'transit',
				label: 'Public Transit'
			},
			{
				key: 'parking',
				label: 'Parking Time'
			},
		]
	},
	shift:{
		layers:[]
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
				label: 'Liquid Propane Gas?'
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
			let update = new Set([...displayed])
			update.add(key)
			setDisplayed(update)
		}
	}
	return (
		<div className="overlayer">
			<h3>Data Layer</h3>
			{
				paradigms[paradigm].layers.map(l=>{
					let activeStatus = displayed.has(l.key) ? 'active' : 'disabled'
					return (
						<div key={l.key} 
							className={`item clickable ${activeStatus}`}
							onClick={(e)=>handleClick(l.key)}>
							{l.label}
						</div>
					)
				})
			}
		</div>
	)
}
