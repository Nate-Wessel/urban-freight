import React, { useState, useEffect, Fragment } from 'react'
import PickupPoint from './PickupPoint'
import ChargingStation from './ChargingStation'
import BikeShare from './BikeShare'
import ParkingLot from './ParkingLot'
import { routeIcon } from '../Shift/routeStyles'
import { fill as parkingFill } from '../Avoid/ParkingTime'

// data availability lookup functions
const bikePaths = (city) => import(`../data/${city.name}/shift/bike.topojson`)
	.then( module => true ).catch( err => false )

// keys should be unique across paradigms
const paradigms = {
	avoid:{
		layers:[
			{
				key: 'Purol',
				label: 'Purolator',
				icon: PickupPoint,
				description: 'Includes parcel pick up and shipping locations. Hover over a point for details.',
				dataAvailable: (city)=>Boolean(city.data?.avoid?.pickupPoints?.purolator)
			},
			{
				key: 'Fedex',
				label: 'Fedex',
				icon: PickupPoint,
				description: 'Includes parcel pick up and shipping locations.',
				dataAvailable: (city)=>Boolean(city.data?.avoid?.pickupPoints?.fedex)
			},
			{
				key: 'UPS',
				label: 'UPS',
				icon: PickupPoint,
				description: 'UPS Store locations.',
				dataAvailable: (city)=>Boolean(city.data?.avoid?.pickupPoints?.ups)
			},
			{
				key: 'Penguin',
				label: 'Penguin',
				icon: PickupPoint,
				description: 'PenguinPickUp retail locations.',
				dataAvailable: (city)=>Boolean(city.data?.avoid?.pickupPoints?.penguin)
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
				},
				dataAvailable: (city)=>Boolean(city.data?.avoid?.parkingSearchTime)
			}
		]
	},
	shift:{
		layers:[
			{
				key:'bike-paths',
				label:'Bike Path',
				icon: routeIcon,
				description: 'Bike paths are fully separate from cars, though generally shared with pedestrians and other modes like skateboards.',
				dataAvailable: bikePaths
			},
			{
				key:'bike-lanes',
				label:'Bike Lane',
				icon: routeIcon,
				description: 'Bike lanes are bike-only infrastructure generally running parallel to other modes between a primarily automotive lane and the sidewalk.',
				dataAvailable: bikePaths
			},
			{
				key:'bike-routes',
				label:'Bike Route',
				icon: routeIcon,
				description: 'Bike "routes" include non-segregated infrastucture that is explicitly signed/designated for use by cyclists. E.g. "sharrows".',
				dataAvailable: bikePaths
			},
			{
				key:'bike-share',
				label:'Bike-share Station',
				icon: BikeShare,
				description: "Hover over a bikeshare station to see its name and designated capacity",
				dataAvailable: (city) => {
					return Promise.resolve( Boolean(city.data?.shift?.bikeShare) )
				}
			},
			{
				key:'parking-lots',
				label:'Parking Lot',
				icon: ParkingLot,
				description: "Surface parking lots. Darker colour indicates municipally operated",
				dataAvailable: (city)=>import(`../data/${city.name}/shift/lu_parking.topojson`).then(mod=>true).catch(err=>false)
					
			}
		]
	},
	improve:{
		layers:[
			{
				key: 'E1',
				label: 'Electric (E1)',
				icon: ChargingStation,
				dataAvailable: (city)=>import(`../data/${city.name}/improve/alt_fuel_stations.topojson`)
					.then( module => fetch(module.default) )
					.then( resp => resp.json() )
					.then( data => data.objects.alt_fuel_stations.geometries.some(g=>g.properties.type=='E1') )
					.catch( err => false )
			},
			{
				key: 'E2',
				label: 'Electric (E2)',
				icon: ChargingStation,
				dataAvailable: (city)=>import(`../data/${city.name}/improve/alt_fuel_stations.topojson`)
					.then( module => fetch(module.default) )
					.then( resp => resp.json() )
					.then( data => data.objects.alt_fuel_stations.geometries.some(g=>g.properties.type=='E2') )
					.catch( err => false )
			},
			{
				key: 'E3',
				label: 'Electric (E3/DC)',
				icon: ChargingStation,
				dataAvailable: (city)=>import(`../data/${city.name}/improve/alt_fuel_stations.topojson`)
					.then( module => fetch(module.default) )
					.then( resp => resp.json() )
					.then( data => data.objects.alt_fuel_stations.geometries.some(g=>g.properties.type=='E3') )
					.catch( err => false )
			},
			{
				key: 'CNG',
				label: 'Compressed Natural Gas',
				icon: ChargingStation,
				dataAvailable: (city)=>import(`../data/${city.name}/improve/alt_fuel_stations.topojson`)
					.then( module => fetch(module.default) )
					.then( resp => resp.json() )
					.then( data => data.objects.alt_fuel_stations.geometries.some(g=>g.properties.type=='CNG') )
					.catch( err => false )
			},
			{
				key: 'LPG',
				label: 'Propane',
				icon: ChargingStation,
				dataAvailable: (city)=>import(`../data/${city.name}/improve/alt_fuel_stations.topojson`)
					.then( module => fetch(module.default) )
					.then( resp => resp.json() )
					.then( data => data.objects.alt_fuel_stations.geometries.some(g=>g.properties.type=='LPG') )
					.catch( err => false )
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
				paradigms[paradigm].layers.map( layer => (
					<Item key={layer.key} 
						layer={layer} zoom={zoom}
						active={displayed.has(layer.key)}
						available={layer.dataAvailable}
						city={city}
						handleClick={handleClick}/>
				) )
			}</div>
			{paradigms[paradigm].layers
				.filter( layer => (
					layer?.subLegend 
					&& displayed.has(layer.key)
					&& layer?.dataAvailable(city)
				) )
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

function Item({layer,active,available,city,handleClick,zoom}){
	const [ isAvailable, setIsAvailable ] = useState(false)
	useEffect(()=>{
		available(city).then( setIsAvailable )
	},[available,city])
	let icon = layer.icon ? <layer.icon layerKey={layer.key} zoom={zoom}/> : null
	const classes = ['item','clickable']
	classes.push( active ? 'active' : 'disabled' )
	if(!isAvailable) classes.push('unavailable');
	return (
		<div onClick={(e)=>handleClick(layer.key)}
			title={layer.description}
			className={classes.join(' ')}>
			<span className="icon">{icon}</span>
			<span className="label">{layer.label}</span>
		</div>
	)
}
