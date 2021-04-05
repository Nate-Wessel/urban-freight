import React from 'react'
import BaseLayer from './BaseLayer'
import OverLayer from './OverLayer'
import './legend.css'

export default function(props){
	const { layer, paradigm, zoom } = props
	return (
		<div id="legend">
			<OverLayer paradigm={paradigm} zoom={zoom}/>
			<BaseLayer layer={layer}/>
		</div>
	)
}
