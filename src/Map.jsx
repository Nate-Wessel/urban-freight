import React, { useState, useEffect } from 'react'
import { MapContainer, useMapEvent, TileLayer, useMap, Pane } from 'react-leaflet'
import { GestureHandling } from 'leaflet-gesture-handling'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import * as L from 'leaflet'
import BaseLayer from './BaseLayer'
import OverLayer from './OverLayer'
import Legend from './Legend'
import 'leaflet/dist/leaflet.css'
import './map.css'

L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

const carto = 'https://basemaps.cartocdn.com'

export default function(props){
	// keep track of zoom-level here and pass as a prop
	const [ zoom, setZoom ] = useState(11)
	const { city, layer, paradigm } = props
	
	const mapWrapperClass = 'map-wrapper active-city-' + city.name
	
	return (
		<div className={mapWrapperClass}>
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
				<OverLayer city={city} paradigm={paradigm}/>
				<BaseLayer city={city} layer={layer}/>
				<TileLayer url={`${carto}/light_nolabels/{z}/{x}/{y}{r}.png`}/>
			</MapContainer>
			<Legend layer={layer}/>
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
