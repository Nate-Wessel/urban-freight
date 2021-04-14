import React from 'react'
import { CircleSvg } from './Circle.jsx'
import { radius } from '../Shift/BikeShare'

export default function(props){
	const { zoom, layerKey } = props
	return (
		<CircleSvg
			color={"White"}
			stroke={"Black"}
			radius={radius(25,zoom)}
			strokeWidth={2}
			fillOpacity={1}/>
	)
}
