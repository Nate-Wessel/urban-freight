import React from 'react'

export function CircleSvg({color,stroke,fillOpacity,radius,strokeWidth}){
	const styleOptions = {
		fill: color ? color : 'grey',
		stroke: stroke ? stroke : 'white',
		'strokeWidth': strokeWidth ? strokeWidth : 1,
		fillOpacity: fillOpacity? fillOpacity : 1
	}
	return (
		<svg width={2*radius+strokeWidth+1} height={2*radius+strokeWidth+1}>
			<circle
				cx={radius+strokeWidth/2}
				cy={radius+strokeWidth/2}
				r={radius}
				style={styleOptions}/>
		</svg>
	)
}
