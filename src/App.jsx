import React, { useState, useRef, useEffect } from "react"
import Map from './Map'
import './nav.less'
import './app.css'

const cities = [
	{
		name: 'Toronto',
		bounds: [[43.8588,-79.6495],[43.5774,-79.1098]],
		geohashSqM: 16890.339665499243
	},
	{
		name: 'Vancouver',
		bounds: [[49.31,-123.2247],[49.19,-122.9782]],
		geohashSqM: 15267.902190214854
	},
	{
		name: 'Edmonton',
		bounds: [[53.6914,-113.7373],[53.3948,-113.2787]],
		geohashSqM: 13919.639948047059
	},
	{
		name: 'Ottawa',
		bounds: [[45.619,-76.434],[44.9,-75.154]],
		geohashSqM: 16890 // TODO what is this variable??
	}
]

export function App(props){
	const [ city, setCity ] = useState(cities[0])
	const [ fullscreen, setFullscreen ] = useState(false)
	const escFn = e => {
		if (e.keyCode == 27) {
			setFullscreen(false)
			e.preventDefault();
		}
	}
	useEffect(() => {
		fullscreen ?
			document.addEventListener("keydown", escFn, false):
			document.removeEventListener("keydown", escFn, false);
  }, [fullscreen]);
	const target = useRef(null)
	const appInnerClass = "urban-freight-wrap" + (fullscreen ? " fullscreen" : "");
	return (
		<div id="app" ref={target}>
			<div className={appInnerClass}>
				<div className="urban-freight-inner">
					<CityNav city={city} setCity={setCity}/>
					<Map city={city} 
						paradigm={props.paradigm} 
						fullscreen={fullscreen} 
						setFullscreen={setFullscreen} 
						fullscreenTarget={target}
					/>					
				</div>
			</div>
		</div>
	)
}

function CityNav({city,setCity}){
	return (
		<div id="city-nav-tabs" className="tab-container city-nav">
			{ cities.map( (c,i) => {
				let cls = 'tab' + (city == c ? ' active' : '') + ' city-' + c.name;
				const click = (e) => setCity(cities[i]);
				return (
					<div key={i} className={cls} onClick={click}>
						{c.name}
					</div>
				)
			} ) }
		</div>
	)
}
