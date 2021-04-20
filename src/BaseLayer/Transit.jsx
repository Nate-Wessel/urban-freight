import React, { useEffect, useRef } from 'react'
import { TileLayer, Pane } from 'react-leaflet'

export default function(props){
	const { city } = props
	const layer = useRef(null)
	useEffect(()=>{
		// url is immutable in react-leaflet
		// need to reset it directly when city changes
		if(!layer.current) return;
		layer.current.setUrl(url(city))
	},[city])
	return (
		<Pane name="transit" style={{zIndex:430}}>
			<TileLayer ref={layer} url={url(city)}/>
		</Pane>
	)
}

function url(city){
	let src = 'https://jamaps.github.io/simple-transit-tiles'
	return `${src}/${city.name}/tiles/{z}/{x}/{y}.png`
}
