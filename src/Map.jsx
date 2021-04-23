import React, { useState, useEffect } from 'react'
import {
	MapContainer, useMapEvent, TileLayer,
	useMap, Pane, ScaleControl
} from 'react-leaflet'
import { GestureHandling } from 'leaflet-gesture-handling'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { baseLayers as baseLayerOptions } from './Legend/BaseLayer'
import BaseLayer from './BaseLayer'
import OverLayer from './OverLayer'
import Legend from './Legend'
import './map.css'
import fullscreenIconClose from './images/fullscreen-1.svg'
import fullscreenIconOpen from './images/fullscreen-2.svg'

L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

const carto = 'https://basemaps.cartocdn.com'

const defaultDisplay = {
	avoid: new Set(['parking','Purol']),
	shift: new Set(['bike-paths','bike-lanes','bike-share']),
	improve: new Set(['E1','E2','E3'])
}

export default function(props){
	const { city, paradigm, fullscreen, setFullscreen, fullscreenTarget } = props
	const [ zoom, setZoom ] = useState(11)
	const [ mainLayer, setMainLayer ] = useState(defaultDisplay[paradigm])
	const [ transit, setTransit ] = useState(true) // boolean
	const [ baseLayer, setBaseLayer ] = useState(baseLayerOptions[0])
	return (
		<div className={`map-wrapper active-city-${city.name}`}>
			<MapContainer
				zoom={zoom} minZoom={10} maxZoom={16}
				maxBoundsViscosity={0.25}
				gestureHandling={true}
				preferCanvas={true}>
				<MapStateProbe
					setZoom={setZoom}
					bounds={city.bounds}/>
				<Pane name="tile-labels" style={{zIndex:450}}>
					<TileLayer url={`${carto}/light_only_labels/{z}/{x}/{y}{r}.png`}/>
				</Pane>
				<Pane name="overlayer" style={{zIndex:449}}>
					<OverLayer city={city}
						paradigm={paradigm} zoom={zoom} displayed={mainLayer}/>
				</Pane>
				<BaseLayer city={city} layer={baseLayer} transit={transit}/>
				<TileLayer url={`${carto}/light_nolabels/{z}/{x}/{y}{r}.png`}
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
				/>
				<ScaleControl position="bottomleft" imperial={false}/>

				<Legend city={city} paradigm={paradigm} zoom={zoom}
				layer={baseLayer} setLayer={setBaseLayer}
				transit={transit} setTransit={setTransit}
				displayed={mainLayer} setDisplayed={setMainLayer}/>

				<FullscreenToggler fullscreen={fullscreen}
					setFullscreen={setFullscreen} target={fullscreenTarget}/>

			</MapContainer>
			
		</div>
	)
}

// this exists because map state can only be got within the MapContainer
function MapStateProbe(props){
	const { setZoom, bounds } = props
	const map = useMapEvent('zoom', () => setZoom( map.getZoom()) )
	useEffect(()=>{
		map.fitBounds(bounds)
		map.setMaxBounds(bounds)
	},[bounds])
	return null
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