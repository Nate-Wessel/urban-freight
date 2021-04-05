import React from 'react'
import { scaleOrdinal } from 'd3-scale'
import { empDensity, popDensity } from '../BaseLayer/DisseminationAreas'

const landuseScale = scaleOrdinal()
	.domain(['green','industrial','retail','residential','other'])
	.range(['#daf8e8','#fecf92','#c7c4fe','#fbeef5','white'])

const baseLayer = {
	Population: {
		title: 'Population Density',
		unit: '1,000 people per square kilometer',
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
		unit: '1,000 jobs per square kilometer',
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

export default function(props){
	const { layer } = props
	if(layer.name == 'None') return null;
	const opts = baseLayer[layer.name]
	return (
		<div id="baselayer" className="layer">
			<span className="title">{opts.title}</span>&nbsp;
			{opts.unit && <span className="subtitle">{opts.unit}</span>}
			<div className="items">{
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
			}</div>
		</div>
	)
}
