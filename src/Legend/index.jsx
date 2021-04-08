import React from 'react'
import BaseLayer from './BaseLayer'
import OverLayer from './OverLayer'
import './legend.less'

export default function(props){
	const { layer, paradigm, zoom, displayed, setDisplayed } = props
	return (
		<div id="legend">
			<OverLayer paradigm={paradigm} zoom={zoom} 
				displayed={displayed} setDisplayed={setDisplayed}/>
			<BaseLayer layer={layer}/>
		</div>
	)
}
