import React from 'react'
import { scaleOrdinal } from 'd3-scale'
import { empDensity, popDensity } from '../BaseLayer/DisseminationAreas'

const landuseScale = scaleOrdinal()
	.domain(['green','industrial','retail','residential','other'])
	.range(['#d5e4cf','#a9d7ea','#bfb2d8','#ffe899','#f6f0de'])

// these objects get passed around a bit but should be considered immutable
export const baseLayers = [
	{
		name: 'Transit',
		tabName: 'Transit',
		title: 'Public Transit',
		items: []
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
		scale: popDensity
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
		scale: empDensity
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
		scale: landuseScale
	},
	{
		name: 'None',
		tabName: 'No base layer'
	}
]

export function BaseLayer({city,layer,setLayer,transit,setTransit}){
	const opts = baseLayers.find( bl => bl.name == layer.name )
	return (
		<div id="baselayer" className="layer">
			<span className="title">
				<b>Base map layers:</b>&nbsp;
			</span>
			<Nav layer={layer} setLayer={setLayer}
				transit={transit} setTransit={setTransit}/>
			{ layer.name != 'None' && <>
				<span className="subtitle">{opts.title}</span>&nbsp;
				{opts.unit && <span className="layerunits">({opts.unit})</span>}
				<div className="items">{
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

function Nav({layer,setLayer,transit,setTransit}){
	return (
		<div className="items">
			{ baseLayers.map( lyr => {
				const active = layer == lyr || (lyr.name == 'Transit' && transit)
				const onClick = lyr.name == 'Transit' ?
					(e) => setTransit(currentVal=>!currentVal) :
					(e) => setLayer(lyr);
				return (
					<div key={lyr.name}
						className={`item clickable ${active?'active':'disabled'}`}
						onClick={onClick}>
						{lyr.tabName}
					</div>
				)
			} ) }
		</div>
	)
}
