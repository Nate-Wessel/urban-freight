import React, { useState, useRef, useEffect } from "react"
import Map from './Map'
import './nav.less'
import './app.css'
import fullscreenIconClose from './images/fullscreen-1.svg'
import fullscreenIconOpen from './images/fullscreen-2.svg'
import { baseLayers } from './Legend/BaseLayer'

const cities = [
	{
		name: 'Toronto',
		bounds: [[43.8588,-79.6495],[43.5774,-79.1098]]
	},
	{
		name: 'Vancouver',
		bounds: [[49.31,-123.2247],[49.19,-122.9782]]
	},
	{
		name: 'Edmonton',
		bounds: [[53.6914,-113.7373],[53.3948,-113.2787]]
	}
]

export function App(props){
	const [ city, setCity ] = useState(cities[0])
	const [ layer, setLayer ] = useState(baseLayers[0])
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
						layer={layer} setLayer={setLayer}
						paradigm={props.paradigm}/>
					<FullscreenToggler fullscreen={fullscreen}
						setFullscreen={setFullscreen} target={target}/>
				</div>
			</div>
		</div>
	)
}

function CityNav(props){
	return (
		<div id="city-nav-tabs" className="tab-container city-nav">
			{ cities.map( (c,i) => {
				let cls = 'tab' + (props.city == c ? ' active' : '') + ' city-' + c.name
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

function FullscreenToggler({fullscreen, setFullscreen, target}){
	return (
		<button
			className="fullscreen-toggler"
			onClick={() => {
				if (fullscreen)
					target.current.scrollIntoView()
				setFullscreen(!fullscreen)
			}
		}>
			<img
				className= "fullscreen-icon"
				src ={fullscreen ? fullscreenIconClose : fullscreenIconOpen}
			/>
		</button>
	)
}
