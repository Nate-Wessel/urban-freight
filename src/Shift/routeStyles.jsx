import React from 'react'
import { scaleOrdinal } from 'd3-scale'

export const color = scaleOrdinal()
	.domain(['bike-paths','bike-lanes','bike-routes'])
	.range(['#50ab28','#2c6917','#4e472f'])
	
export function routeIcon({layerKey,zoom}){
	return (
		<svg width="30" height="10">
			<path d={`M0,5 L 30,5`} strokeWidth="2" stroke={color(layerKey)} />
		</svg>
	)
}
