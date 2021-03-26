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
	{name: 'Employment'},
	{name: 'Population'},
	{name: 'Landuse'}
]

export default function(props){
	const [ city, setCity ] = useState(cities[0])
	const [ layer, setLayer ] = useState(layers[0])
	return (
		<div id="app">
			<div id="nav-tabs">
				<CityNav city={city} setCity={setCity}/>
				<LayerNav layer={layer} setLayer={setLayer}/>
			</div>
			<Map city={city} layer={layer} paradigm={props.paradigm}/>
		</div>
	)
}

function CityNav(props){
	return (
		<div className="tab-container">
			{ cities.map( (c,i) => {
				let cls = 'tab' + (props.city == c ? ' active' : '')
				function click(e){ props.setCity(cities[i]) }
				return (
					<div key={i} className={cls} onClick={click}>
						{c.name}
					</div>
				)
			} ) }
		</div>
	)
}

function LayerNav(props){
	return (
		<div className="tab-container">
			{ layers.map( (l,i) => {
				let cls = 'tab' + (props.layer == l ? ' active' : '')
				function click(e){ props.setLayer(layers[i]) }
				return (
					<div key={i} className={cls} onClick={click}>
						{l.name}
					</div>
				)
			} ) }
		</div>
	)
}
