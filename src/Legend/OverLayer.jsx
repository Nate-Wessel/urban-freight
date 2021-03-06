import React, { Fragment } from 'react'
import PickupPoint from './PickupPoint'
import ChargingStation from './ChargingStation'
import BikeShare from './BikeShare'
import ParkingLot from './ParkingLot'
import { routeIcon } from '../Shift/routeStyles'
import { fill as parkingFill } from '../Avoid/ParkingTime'

// keys should be unique across paradigms
const paradigms = {
	avoid:{
		layers:[
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
			},
			{
				key: 'parking',
				label: 'Parking Search Time',
				description: 'Average time trucks spend looking for parking. Hover to see the estimated time in minutes.',
				subLegend:{
					title: 'Average Parking Search Time',
					scale: parkingFill,
					icons: [
						{v:1,label:'1-3 minutes',color:'#f001'},
						{v:3,label:'3-5 minutes',color:'#0f01'},
						{v:5,label:'> 5 minutes',color:'#00f1'}
					]
				}
			}
		]
	},
	shift:{
		layers:[
			{
				key:'bike-paths',
				label:'Bike Path',
				icon: routeIcon,
				description: 'Bike paths are fully separate from cars, though generally shared with pedestrians and other modes like skateboards.'

			},
			{
				key:'bike-lanes',
				label:'Bike Lane',
				icon: routeIcon,
				description: 'Bike lanes are bike-only infrastructure generally running parallel to other modes between a primarily automotive lane and the sidewalk.'
			},
			{
				key:'bike-routes',
				label:'Bike Route',
				icon: routeIcon,
				description: 'Bike "routes" include non-segregated infrastucture that is explicitly signed/designated for use by cyclists. E.g. "sharrows".'
			},
			{
				key:'bike-share',
				label:'Bike-share Station',
				icon: BikeShare,
				description: "Hover over a bikeshare station to see its name and designated capacity"
			},
			{
				key:'parking-lots',
				label:'Parking Lot',
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

export default function({paradigm,city,zoom,displayed,setDisplayed}){
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
				paradigms[paradigm].layers.map( l => (
					<Item key={l.key} 
						layer={l} zoom={zoom}
						active={displayed.has(l.key)}
						handleClick={handleClick}/>
				) )
			}</div>
			{paradigms[paradigm].layers
				.filter( l => l?.subLegend && displayed.has(l.key) )
				.map( (l,li) => (
					<Fragment key={li}>
						<span className="subtitle">{l.subLegend.title}</span>
						<div className="items">
						{l.subLegend.icons.map((icon,ii)=>(
							<div key={ii} className="item">
								<div className="swatch"
									style={ { backgroundColor: l.subLegend.scale(icon.v) } }>
								</div>
								<div className="baselabel">{icon.label}</div>
							</div>
						))}
						</div>
					</Fragment>
				) )
			}
		</div>
	)
}

function Item({layer,active,handleClick,zoom}){
	let icon = layer.icon ? <layer.icon layerKey={layer.key} zoom={zoom}/> : null
	return (
		<div onClick={(e)=>handleClick(layer.key)}
			title={layer.description}
			className={`item clickable ${active ? 'active' : 'disabled'}`}>
			<span className="icon">{icon}</span>
			<span className="label">{layer.label}</span>
		</div>
	)
}
