import React, { useState, useEffect } from 'react'
import { scaleLinear } from 'd3-scale'
import './chart.less'

const margin = {t:10,b:40,l:100,r:10}

const [ width, height ] = [ 500, 200 ]

const data = [
	{
		city: 'Toronto',
		diesel: 1.00108,
		gasoline: 1.1138
	},
	{
		city: 'Edmonton',
		diesel: 0.9754,
		gasoline: 1.0005
	},
	{
		city: 'Vancouver',
		diesel: 1.1449,
		gasoline: 1.3642
	},
]

const chartX = scaleLinear()
	.domain([0,1.5])
	.range([margin.l,width-margin.r])

export default function(props){

	return (
		<svg id="fuel-chart" width={width} height={height}>
			<XAxis/>
		</svg>
	)
}

function XAxis(props){
	const ymin = height - margin.b
	const ticks = chartX.ticks().map( t => {
		return (
			<g key={t} className="tick" transform={`translate(${chartX(t)},0)`}>
				<path d={`M0,0 L0,10`}/>
				<text x={0} y={20}>{t}</text>
			</g>
		)
	} )
	return (
		<g id="x-axis" transform={`translate(0,${ymin})`}>
			<path d={`M${chartX(0)},0 L${chartX(1.5)},0`}/>
			{ticks}
		</g>
	)
}
