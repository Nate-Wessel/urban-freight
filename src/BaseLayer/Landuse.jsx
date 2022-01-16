import React, { useEffect, useRef } from 'react'
import { TileLayer, Pane } from 'react-leaflet'

export default function({city}){
	const layer = useRef(null)
	useEffect(()=>{
		// url is immutable in react-leaflet
		// need to reset it directly when city changes
		if(!layer.current) return;
		layer.current.setUrl(url(city))
	},[city])
	if(!city.data?.base?.tiles?.landuse) return null;
	return (
		<Pane name="landuse" style={{zIndex:430}}>
			<TileLayer ref={layer} url={url(city)}/>
		</Pane>
	)
}

function url(city){
	let src = 'https://jamaps.github.io/land-use-tiles'
	return `${src}/${city.name}/tiles/{z}/{x}/{y}.png`
}
