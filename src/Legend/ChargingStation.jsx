import React from 'react'
import { CircleSvg } from './Circle.jsx'
import { color, pointRadius, pointWeight } from '../Improve/scales.js'

export default function(props){
	const { zoom, layerKey } = props
	return (
		<CircleSvg 
			color={color(layerKey)} 
			radius={pointRadius(zoom)}
			strokeWidth={pointWeight(zoom)}/>
	)
}
