import React from 'react'
import { CircleSvg } from './Circle.jsx'
import { style, radius } from '../Shift/BikeShare'

export default function(props){
	const { zoom, layerKey } = props
	return (
		<CircleSvg
			color={style.fillColor} 
			stroke={style.color}
			radius={radius(30,zoom)}
			strokeWidth={1}
			fillOpacity={style.fillOpacity}/>
	)
}
