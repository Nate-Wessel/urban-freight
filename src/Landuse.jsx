import React from 'react'
import { TileLayer, Pane } from 'react-leaflet'

export default function(props){
	const { city } = props
	return (
		<Pane name="landuse" style={{zIndex:430}}>
			<TileLayer url={`/urban-freight/src/data/${city.name}/tiles/{z}/{x}/{y}.png`}/>
		</Pane>
	)
}
