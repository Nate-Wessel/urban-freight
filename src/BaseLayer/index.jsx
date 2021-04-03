import React from 'react'
import { LayerGroup, Pane } from 'react-leaflet'
import { DisseminationAreas } from './DisseminationAreas'
import CityBoundary from './CityBoundary'
import Landuse from './Landuse'

const DaLayers = new Set(['Employment','Population'])

export default function(props){
	const { layer, city } = props
	return (
		<LayerGroup>
			<Pane name="city-border" style={{zIndex:440}}>
				<CityBoundary city={city} layer={layer}/>
			</Pane>
			{ layer.name == 'Landuse' &&
				<Landuse city={city}/>
			}
			{ DaLayers.has(layer.name) &&
				<DisseminationAreas city={city} layer={layer}/>
			}
		</LayerGroup>
	)
}
