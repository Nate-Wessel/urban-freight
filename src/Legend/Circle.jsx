import React from 'react'

export function CircleSvg(props){
	const { color, radius, strokeWidth } = props
	const styleOptions = {
		fill: color,
		stroke: 'white',
		'strokeWidth': strokeWidth
	}
	return (
		<svg width={2*radius+strokeWidth} height={2*radius+strokeWidth}>
			<circle 
				cx={radius+strokeWidth/2}
				cy={radius+strokeWidth/2} 
				r={radius}
				style={styleOptions}/>
		</svg>
	)
}
