import React, { useState, useEffect } from 'react'
import { scaleLinear } from 'd3-scale'
import './chart.less'

const margin = {t:10,b:40,l:100,r:10}

const [ width, height ] = [ 500, 200 ]

const cities = [
	{
		label: 'Toronto',
		diesel: 40.34,
		gasoline: 29.24,
		electricHDT: 17.87,
		electricMDT: 2.60
	},
	{
		label: 'Edmonton',
		diesel: 40.88,
		gasoline: 29.23,
		electricHDT: 22.825,
		electricMDT: 3.32
	},
	{
		label: 'Vancouver',
		diesel: 50.30,
		gasoline: 35.81,
		electricHDT: 17.325,
		electricMDT: 2.52
	},
]

const chartX = scaleLinear()
	.domain( [ 0, 50 ] )
	.range( [ margin.l, width-margin.r ] )

export default function(props){
	return (
		<svg id="fuel-chart" width={width} height={height}>
			{cities.map( (city,i) => (
				<City key={city.label} data={city} position={i}/>
			))}
			<XAxis/>
		</svg>
	)
}

function City(props){
	const { data, position } = props
	let zero = chartX(0)
	let diesel = chartX(data.diesel)
	let gas = chartX(data.gasoline)
	return (
		<g className="city" transform={`translate(0,${30+position*50})`}>
			<text x={zero} y={0}>{data.label}&nbsp;</text>
			<path className="diesel" 
				d={`M${zero},-11 L${diesel},-11 L${diesel},-1 L${zero},-1 z`}/>
			<circle className="ev HDT" cx={chartX(data.electricHDT)} cy={-6} r="5"/>
			<path className="gasoline" 
				d={`M${zero},11 L${gas},11 L${gas},1 L${zero},1 z`}/>
			<circle className="ev MDT" cx={chartX(data.electricMDT)} cy={6} r="5"/>
		</g>
	)
}

function XAxis(props){
	const ymin = height - margin.b
	const ticks = chartX.ticks().map( t => {
		return (
			<g key={t} className="tick" transform={`translate(${chartX(t)},0)`}>
				<path d={`M0,0 L0,10`}/>
				<text x={0} y={20}>{`$${t}`}</text>
			</g>
		)
	} )
	return (
		<g id="x-axis" transform={`translate(0,${ymin})`}>
			<path d={`M${chartX(0)},0 L${chartX(50)},0`}/>
			{ticks}
		</g>
	)
}
