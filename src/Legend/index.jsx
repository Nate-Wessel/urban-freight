import React from 'react'
import { BaseLayer } from './BaseLayer'
import OverLayer from './OverLayer'
import './legend.less'

export default function(props){
	const { 
		city, paradigm, zoom, 
		layer, setLayer, 
		displayed, setDisplayed 
	} = props
	return (
		<div id="legend">
			<OverLayer paradigm={paradigm} zoom={zoom} city={city}
				displayed={displayed} setDisplayed={setDisplayed}/>
			<BaseLayer layer={layer} setLayer={setLayer} city={city}/>
		</div>
	)
}
