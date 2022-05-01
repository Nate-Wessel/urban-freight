import React, { useState, useEffect } from 'react'
import { scaleOrdinal } from 'd3-scale'
import { empDensity, popDensity } from '../BaseLayer/DisseminationAreas'

const landuseScale = scaleOrdinal()
	.domain(['green','industrial','retail','residential','other'])
	.range(['#d5e4cf','#a9d7ea','#bfb2d8','#ffe899','#f6f0de'])

function hasDAs(city){
	return import(`../data/${city.name}/da_polygons.topojson`)
		.then( module => true )
		.catch( err => false );
}

// these objects get passed around a bit but should be considered immutable
export const baseLayers = [
	{
		name: 'Transit',
		tabName: 'Transit',
		dataAvailable: (city)=>Promise.resolve(city.data?.base?.tiles?.transit)
			.then(mod=>true).catch(err=>false)
	},
	{
		name: 'Population',
		tabName: 'Population',
		title: 'Population Density',
		unit: 'people per square kilometer',
		items: [
			{v:12,label:' <1,000'},
			{v:4000,label:' 1,000 to 5,000'},
			{v:6000,label:' 5,000 to 10,000'},
			{v:12000,label:' 10,000 to 20,000'},
			{v:22000,label:' 20,000+'}
		],
		scale: popDensity,
		dataAvailable: hasDAs
	},
	{
		name: 'Employment',
		tabName: 'Employment',
		title: 'Employment Density',
		unit: 'jobs per square kilometer',
		items: [
			{v:12,label:' <1,000'},
			{v:4000,label:' 1,000 to 5,000'},
			{v:6000,label:' 5,000 to 10,000'},
			{v:12000,label:' 10,000 to 20,000'},
			{v:22000,label:' 20,000+'}
		],
		scale: empDensity,
		dataAvailable: hasDAs
	},
	{
		name: 'Landuse',
		tabName: 'Landuse',
		title: 'Prevailing Landuse',
		items: [
			{v:'green',label:'Green Space'},
			{v:'industrial',label:'Industrial'},
			{v:'retail',label:'Commercial/Retail'},
			{v:'residential',label:'Residential'},
			{v:'other',label:'Other'}
		],
		scale: landuseScale,
		dataAvailable: (city)=>Promise.resolve(
			Boolean(city.data?.base?.tiles?.landuse)
		)
	}
]

export function BaseLayer({city,layer,setLayer,transit,setTransit}){
	const opts = baseLayers.find( bl => bl.name == layer.name )
	return (
		<div id="baselayer" className="layer">
			<span className="title">
				Base map layers:
			</span>
			<Nav layer={layer} setLayer={setLayer} city={city}
				transit={transit} setTransit={setTransit}/>
			{ opts?.title && <>
				<div className="subtitle-units">
					<span className="subtitle">{opts.title}</span>&nbsp;
					{opts.unit && <span className="layerunits">({opts.unit})</span>}
				</div>
				<div className="items layer-swatches">{
					opts.items.map( item => {
						return (
							<div key={item.v} className="item">
								<div className="swatch"
									style={ { backgroundColor: opts.scale(item.v) } }>
								</div>
								<div className="baselabel">{item.label}</div>
							</div>
						)
					} )
				}</div>
			</> }
		</div>
	)
}

function Nav({city,layer,setLayer,transit,setTransit}){
	return (
		<div className="items">
			{ baseLayers.map( lyr => {
				const classes = ['item','clickable']
				const active = lyr.name == 'Transit' ? transit : (layer == lyr)
				const onClick = lyr.name == 'Transit' ?
					(e) => setTransit(currentVal=>!currentVal) :
					(e) => layer == lyr ? setLayer({name:'None'}) : setLayer(lyr);
				return ( 
					<div onClick={onClick} key={lyr.name}>
						<Layer lyr={lyr} active={active}
							dataProm={lyr.dataAvailable(city)}/>
					</div>
				)
			} ) }
		</div>
	)
}

function Layer({lyr,dataProm,active}){
	const [ available, setAvailable ] = useState(false)
	useEffect(()=>{
		dataProm.then(setAvailable)
	},[dataProm])
	const classes = ['item','clickable']
	if(!available) classes.push('unavailable')
	classes.push( active ? 'active' : 'disabled' )
	return (
		<div className={classes.join(' ')}>
			{lyr.name}
		</div>
	)
}
