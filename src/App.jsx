import React, { useState } from "react"
import Map from './Map'
import './nav.css'

const cities = [
	{
		name: 'Toronto',
		bounds: [[43.8588,-79.6495],[43.5774,-79.1098]]
	},
	{
		name: 'Vancouver',
		bounds: [[49.3260,-123.2247],[49.1799,-122.9782]]
	},
	{
		name: 'Edmonton',
		bounds: [[53.6914,-113.7373],[53.3948,-113.2787]]
	}
]

const layers = [
	{name: 'Population'},
	{name: 'Employment'},
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
