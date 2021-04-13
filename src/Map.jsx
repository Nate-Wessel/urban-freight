import React, { useState, useEffect } from 'react'
import {
	MapContainer, useMapEvent, TileLayer,
	useMap, Pane, ScaleControl
} from 'react-leaflet'
import { GestureHandling } from 'leaflet-gesture-handling'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import BaseLayer from './BaseLayer'
import OverLayer from './OverLayer'
import Legend from './Legend'
import './map.css'

L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

const carto = 'https://basemaps.cartocdn.com'

const defaultDisplay = {
	avoid: new Set(['transit','parking','Purol']),
	shift: new Set(['bike-paths','bike-lanes','bike-routes','bike-share']),
	improve: new Set(['ELEC'])
}

export default function(props){
	const { city, layer, paradigm } = props
	// keep track of zoom-level here and pass as a prop
	const [ zoom, setZoom ] = useState(11)
	const [ displayed, setDisplayed ] = useState(defaultDisplay[paradigm])
	return (
		<div className={`map-wrapper active-city-${city.name}`}>
			<MapContainer
				zoom={zoom} minZoom={10} maxZoom={16}
				maxBoundsViscosity={0.25}
				gestureHandling={true}>
				<MapStateProbe
					setZoom={setZoom}
					bounds={city.bounds}/>
				<Pane name="tile-labels" style={{zIndex:450}}>
					<TileLayer url={`${carto}/light_only_labels/{z}/{x}/{y}{r}.png`}/>
				</Pane>
				<Pane name="overlayer" style={{zIndex:449}}>
					<OverLayer city={city}
						paradigm={paradigm} zoom={zoom} displayed={displayed}/>
				</Pane>
				<BaseLayer city={city} layer={layer}/>
				<TileLayer url={`${carto}/light_nolabels/{z}/{x}/{y}{r}.png`}/>
				<ScaleControl position="bottomleft" imperial={false}/>
			</MapContainer>
			<Legend layer={layer} city={city} paradigm={paradigm} zoom={zoom}
				displayed={displayed} setDisplayed={setDisplayed}/>
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
