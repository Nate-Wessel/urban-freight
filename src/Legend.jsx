import React from 'react'
import { empDensity, popDensity } from './DisseminationAreas'
import './legend.css'

const baseLayer = {
	Population: {
		title: 'Population Density',
		unit: '1000 people per square kilometer',
		items: [
			{v:12,label:'<1k'},
			{v:4000,label:'1k-5k'},
			{v:6000,label:'5k-10k'},
			{v:12000,label:'10k-20k'},
			{v:22000,label:'20k+'}
		],
		scale: popDensity
	},
	Employment: {
		title: 'Employment Density',
		unit: '1000 jobs per square kilometer',
		items: [
			{v:12,label:'<1k'},
			{v:4000,label:'1k-5k'},
			{v:6000,label:'5k-10k'},
			{v:12000,label:'10k-20k'},
			{v:22000,label:'20k+'}
		],
		scale: empDensity
	},
	Landuse: {
		title: 'Prevailing Landuse',
		unit: null,
		items: [
			{v:'green',label:'Green Space'},
			{v:'industrial',label:'Industrial'},
			{v:'retail',label:'Retail'},
			{v:'residential',label:'Residential'},
			{v:'other',label:'Other'}
		],
		scale: landuseScale
	}
}

function landuseScale(value){
	switch(value){
		case 'green':
			return '#daf8e8'
		case 'industrial':
			return '#fecf92'
		case 'retail':
			return '#c7c4fe'
		case 'residential':
			return '#fbeef5'
		case 'other':
			return 'white'
	}
}

export default function(props){
	const { layer } = props
	if(layer.name == 'None') return null;
	const opts = baseLayer[layer.name]
	return (
		<div className="legend baselayer">
			<h3>{opts.title}</h3>
			{opts.unit && <p>{opts.unit}</p>}
			{
				opts.items.map( item => {
					return (
						<div key={item.v} className="item">
							<div className="swatch"
								style={ { backgroundColor: opts.scale(item.v) } }>
							</div>
							<div className="label">{item.label}</div>
						</div>
					)
				} )
			}
		</div>
	)
}
