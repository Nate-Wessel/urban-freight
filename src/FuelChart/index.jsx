import React, { useState, useEffect } from 'react'
import { scaleLinear } from 'd3-scale'
import './chart.less'

// layout

const margin = {t:10,b:40,l:100,r:15}

const [ width, height ] = [ 800, 200 ]

const barWidth = 20

const chartX = scaleLinear()
	.domain( [ 0, 50 ] )
	.range( [ margin.l, width-margin.r ] )

// data
const MPG = { // miles per gallon
	HDT: 6.74,
	MDT: 9.87
}
const KPL = { // kilometers per liter
	HDT: (MPG.HDT*1.609344)/4.54609,
	MDT: (MPG.MDT*1.609344)/4.54609
}

const KPK = { // kilometers per kilowatt hour
	HDT: 400/550,
	MDT: 339/75
}

const cents = { // cents per unit energy by time and place
	Toronto: {
		diesel:{ // per liter
			'2020': 100.10833,
			'2019': 117.65833,
			'2018': 125.29166,
			'2017': 107.65
		},
		gasoline: { // per liter
			'2020': 111.3875,
			'2019': 127.3625,
			'2018': 136.204166,
			'2017': 122.595833
		},
		electric: { // per kilowatt hour
			'2020': 13,
			'2019': 13, // TODO estimated
			'2018': 0,
			'2017': 0
		}
	},
	Edmonton: {
		diesel:{
			'2020': 97.54166,
			'2019': 115.0333,
			'2018': 124.175,
			'2017': 104.45
		},
		gasoline: {
			'2020': 100.05,
			'2019': 112.520833,
			'2018': 125.741666,
			'2017': 107.066666
		},
		electric: { 
			'2020': 16.6,
			'2019': 16.6, // TODO estimated
			'2018': 0,
			'2017': 0
		}
	},
	Vancouver: {
		diesel:{
			'2020': 114.49166,
			'2019': 136.9333,
			'2018': 139.7,
			'2017': 120.8666
		},
		gasoline: {
			'2020': 136.420833,
			'2019': 159.4625,
			'2018': 159.920833,
			'2017': 143.7875
		},
		electric: { // per kilowatt hour
			'2020': 12.6,
			'2019': 12.6, // TODO estimated
			'2018': 0,
			'2017': 0
		}
	}
}

const cities = ['Toronto','Edmonton','Vancouver']

export default function(props){
	const [ year, setYear ] = useState('2020')
	return (
		<svg id="fuel-chart" width={width} height={height}>
			{cities.map( (city,i) => (
				<City key={city} city={city} year={year} position={i}/>
			))}
			<Axis/>
		</svg>
	)
}

function City({city,position,year}){
	let zero = chartX(0)
	
	// calculate prices in $/100km
	
	let dieselPrice = (100/KPL.HDT)*(cents[city].diesel[year]/100)
	let diesel = chartX(dieselPrice)
	let gasPrice = (100/KPL.MDT)*(cents[city].gasoline[year]/100)
	let gas = chartX(gasPrice)
	
	let electricHDTPrice = (100/KPK.HDT)*(cents[city].electric[year]/100)
	let electricMDTPrice = (100/KPK.MDT)*(cents[city].electric[year]/100)
	
	return (
		<g className="city" transform={`translate(0,${30+position*50})`}>
			<text x={zero} y={0}>{city}&nbsp;</text>
			<path className="diesel" 
				d={`M${zero},${-barWidth-1} L${diesel},${-barWidth-1} L${diesel},-1 L${zero},-1 z`}/>
			<circle className="ev HDT" 
				cx={chartX(electricHDTPrice)} 
				cy={-barWidth/2-1} 
				r={barWidth/2}/>
			<path className="gasoline" 
				d={`M${zero},${barWidth+1} L${gas},${barWidth+1} L${gas},1 L${zero},1 z`}/>
			<circle className="ev MDT" 
				cx={chartX(electricMDTPrice)} 
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
