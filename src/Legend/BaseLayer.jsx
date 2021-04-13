import React from 'react'
import { scaleOrdinal } from 'd3-scale'
import { empDensity, popDensity } from '../BaseLayer/DisseminationAreas'

const landuseScale = scaleOrdinal()
	.domain(['green','industrial','retail','residential','other'])
	.range(['#daf8e8','#fecf92','#c7c4fe','#fbeef5','white'])

const baseLayer = {
	Population: {
		title: 'Population Density',
		unit: '(people per square kilometer)',
		items: [
			{v:12,label:' <1,000'},
			{v:4000,label:' 1,000 to 5,000'},
			{v:6000,label:' 5,000 to 10,000'},
			{v:12000,label:' 10,000 to 20,000'},
			{v:22000,label:' 20,000+'}
		],
		scale: popDensity
	},
	Employment: {
		title: 'Employment Density',
		unit: '(jobs per square kilometer)',
		items: [
			{v:12,label:' <1,000'},
			{v:4000,label:' 1,000 to 5,000'},
			{v:6000,label:' 5,000 to 10,000'},
			{v:12000,label:' 10,000 to 20,000'},
			{v:22000,label:' 20,000+'}
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
			<span className="title">
				<b>Base map layers:</b>&nbsp;
			</span>
			<span className="subtitle">{opts.title}</span>&nbsp;
			{opts.unit && <span className="layerunits">{opts.unit}</span>}
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
		</div>
	)
}
