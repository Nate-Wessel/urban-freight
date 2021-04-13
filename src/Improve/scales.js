import { scaleOrdinal, scalePow } from 'd3-scale'

export const keys = ['ELEC','CNG','LPG']

export const color = scaleOrdinal()
	.domain(keys)
	.range(['#d64a00','#a13134','#4e472f'])

export const pointRadius = scalePow()
	.exponent(2)
	.domain([10,16])
	.range([3,9])

export const pointWeight = scalePow()
	.exponent(2)
	.domain([10,16])
	.range([1,3])
