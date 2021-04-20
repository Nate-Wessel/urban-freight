import { scaleOrdinal, scalePow } from 'd3-scale'

export const keys = ['E1','E2','E3','CNG','LPG']

export const color = scaleOrdinal()
	.domain(keys)
	.range(['#24b563','#2ba4e0','#5b29cf','#d64a00','#ff0084'])

export const pointRadius = scalePow()
	.exponent(2)
	.domain([10,16])
	.range([3,9])

export const pointWeight = scalePow()
	.exponent(2)
	.domain([10,16])
	.range([1,3])
