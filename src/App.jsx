import React, { useState } from "react"
import Map from './Map'
import './nav.css'

const cities = [
	{ 
		name: 'Toronto',
		center: [43.65,-79.37]
	},
	{
		name: 'Vancouver',
		center: [49.26,-123.07]
	},
	{
		name: 'Edmonton',
		center: [53.53,-113.5]
	}
]

const layers = [
	{
		name: 'Employment'
	},
	{
		name: 'Population'
	},
	{
		name: 'Landuse'
	}
]

export default function(props){
	const [ city, setCity ] = useState(cities[0])
	const [ baseLayer, setBaseLayer ] = useState(layers[0])
	return (
		<div id="app">
			<CityNav city={city} setCity={setCity}/>
			<LayerNav layer={baseLayer} setLayer={setBaseLayer}/>
			<Map city={city} baseLayer={baseLayer} paradigm={props.paradigm}/>
		</div>
	)
}

function CityNav(props){
	return (
		<nav>
			{ cities.map( (c,i) => {
				let cls = 'city-link' + (props.city == c ? ' active' : '')
				function click(e){ props.setCity(cities[i]) }
				return (
					<div key={i} className={cls} onClick={click}>
						{c.name}
					</div>
				)
			} ) }
		</nav>
	)
}

function LayerNav(props){
	return (
		<nav>
			{ layers.map( (l,i) => {
				let cls = 'layer-link' + (props.layer == l ? ' active' : '')
				function click(e){ props.setLayer(layers[i]) }
				return (
					<div key={i} className={cls} onClick={click}>
						{l.name}
					</div>
				)
			} ) }
		</nav>
	)
}
