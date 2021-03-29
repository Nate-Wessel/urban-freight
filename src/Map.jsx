import React, { useState, useEffect } from 'react'
import { MapContainer, useMapEvent, TileLayer, useMap, Pane } from 'react-leaflet'
import BaseLayer from './BaseLayer'
import './leaflet.css'
import './map.css'

export default function(props){
	// keep track of zoom-level here and pass as a prop
	const [ zoom, setZoom ] = useState(11)
	const { city, layer } = props
	return (
		<MapContainer zoom={zoom} minZoom={10} maxZoom={16} zoomControl={false}>
			<MapStateProbe
				setZoom={setZoom}
				bounds={city.bounds}/>
			<Pane name="tile-labels" style={{zIndex:450}}>
				<TileLayer url="https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"/>
			</Pane>
			<BaseLayer city={city} layer={layer}/>
			<TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"/>
		</MapContainer>
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
