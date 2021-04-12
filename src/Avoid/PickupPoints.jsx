import React from 'react'
import { CircleMarker } from 'react-leaflet'
import { scaleOrdinal, scalePow } from 'd3-scale'
import { geojson2leaflet } from '../geojson2leaflet'

export const operators = ['Purol','Fedex','UPS','Penguin']

export const color = scaleOrdinal()
	.domain(operators)
	.range(['#a13134','#622f89','#4e472f','#d64a00'])

export const pointRadius = scalePow()
	.exponent(2)
	.domain([10,16])
	.range([3,9])

export const pointWeight = scalePow()
		.exponent(2)
		.domain([10,16])
		.range([1,3])

export function PickupPoints(props){
	const { features, zoom } = props
	let styleOptions = {
		opacity: 1,
		fillOpacity: 1,
		weight: pointWeight(zoom),
		color: 'white'
	}
	return features.map( (feat,i) => {
		let ll = geojson2leaflet(feat.geometry)
		let clr = color(feat.properties.type)
		return (
			<CircleMarker key={`${feat.properties.type}/${i}`}
				center={ll} radius={pointRadius(zoom)}
				pathOptions={{...styleOptions,...{fillColor:clr}}}/>
		)
	} )
}
