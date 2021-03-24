import React, { useState, useEffect } from 'react'
import { MapContainer, useMapEvent, TileLayer, useMap } from 'react-leaflet'
import ContextLayer from './ContextLayer'
import './leaflet.css'
import './map.css'

export default function(props){
	// keep track of zoom-level here and pass as a prop
	const [ zoom, setZoom ] = useState(12)
	return (
		<MapContainer center={props.city.center}
			zoom={zoom} minZoom={3} maxZoom={18} zoomControl={false}>
			<MapStateProbe setZoom={setZoom} center={props.city.center}/>
			<ContextLayer city={props.city}/>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
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
