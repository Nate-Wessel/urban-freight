import React, { useState, useEffect } from 'react'
import { MapContainer, useMapEvent, TileLayer, useMap, Pane } from 'react-leaflet'
import BaseLayer from './BaseLayer'
import './leaflet.css'
import './map.css'

export default function(props){
	// keep track of zoom-level here and pass as a prop
	const [ zoom, setZoom ] = useState(11)
	return (
		<MapContainer center={props.city.center}
			zoom={zoom} minZoom={8} maxZoom={17} zoomControl={false}>
			<MapStateProbe setZoom={setZoom} center={props.city.center}/>
			<Pane name="tile-labels" style={{zIndex:450}}>
				<TileLayer url="https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"/>
			</Pane>
			<BaseLayer city={props.city} layer={props.layer}/>
			<TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"/>
		</MapContainer>
	)
}

// this exists because map state can only be got within the MapContainer
function MapStateProbe(props){
	const map = useMapEvent('zoom', () => props.setZoom( map.getZoom()) )
	useEffect(()=>{
		map.panTo(props.center)
	},[props.center])
	return null
}
