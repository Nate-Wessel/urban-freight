import React from 'react'
import { LayerGroup } from 'react-leaflet'
import DisseminationAreas from './DisseminationAreas'
import CityBoundary from './CityBoundary'

export default function(props){
	// not yet supported
	if(props.layer.name == 'Landuse'){ return null }
	return (
		<LayerGroup>
			<CityBoundary city={props.city}/>
			<DisseminationAreas city={props.city} layer={props.layer}/>
		</LayerGroup>
	)
}
