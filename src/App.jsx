import React, { useState, useRef, useEffect } from "react"
import Map from './Map'
import './nav.less'
import './app.css'

import { cities } from './data/cities.js'

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
