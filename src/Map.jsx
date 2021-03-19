import React, { useState } from 'react'
import { MapContainer, useMapEvent, TileLayer } from 'react-leaflet'
import './leaflet.css'
import './map.css'

const defaultCenter = [39.11065,-84.50524]

export default function(){
	// keep track of zoom-level here and pass as a prop
	const [ zoom, setZoom ] = useState(12)
	return (
		<MapContainer center={defaultCenter}
			zoom={zoom} minZoom={8} maxZoom={18} zoomControl={false}>
			<MapStateProbe setZoom={setZoom}/>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
		</MapContainer>
	)
}

// this exists because map state can only be got within the MapContainer
function MapStateProbe(props){
	let map = useMapEvent('zoom', () => {
		props.setZoom(map.getZoom())
	})
	return null	
}
