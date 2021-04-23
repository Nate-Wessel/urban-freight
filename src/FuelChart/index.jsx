import React, { useState, useEffect } from 'react'
import { scaleLinear } from 'd3-scale'
import './chart.less'

const margin = {t:10,b:40,l:100,r:15}

const [ width, height ] = [ 800, 200 ]

const barWidth = 20

const cities = [
	{
		label: 'Toronto',
		diesel: 40.34,
		gasoline: 29.24,
		electricHDT: 17.87,
		electricMDT: 2.87
	},
	{
		label: 'Edmonton',
		diesel: 40.88,
		gasoline: 29.23,
		electricHDT: 22.825,
		electricMDT: 3.67
	},
	{
		label: 'Vancouver',
		diesel: 50.30,
		gasoline: 35.81,
		electricHDT: 17.325,
		electricMDT: 2.78
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
			<Axis/>
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
				d={`M${zero},${-barWidth-1} L${diesel},${-barWidth-1} L${diesel},-1 L${zero},-1 z`}/>
			<circle className="ev HDT" 
				cx={chartX(data.electricHDT)} 
				cy={-barWidth/2-1} 
				r={barWidth/2}/>
			<path className="gasoline" 
				d={`M${zero},${barWidth+1} L${gas},${barWidth+1} L${gas},1 L${zero},1 z`}/>
			<circle className="ev MDT" 
				cx={chartX(data.electricMDT)} 
				cy={barWidth/2+1} 
				r={barWidth/2}/>
		</g>
	)
}

function Axis(props){
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
		<>
			<path className="y-base-line"
				d={`M${chartX(0)},0 L${chartX(0)},${ymin}`}/>
			<g id="x-axis" transform={`translate(0,${ymin})`}>
				<path d={`M${chartX(0)},0 L${chartX(50)},0`}/>
				{ticks}
			</g>
		</>
	)
}
