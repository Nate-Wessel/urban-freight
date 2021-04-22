import React from 'react'
import { LayerGroup, Pane } from 'react-leaflet'
import { DisseminationAreas } from './DisseminationAreas'
import CityBoundary from './CityBoundary'
import Landuse from './Landuse'
import Transit from './Transit'

const DaLayers = new Set(['Employment','Population'])

export default function({city,layer,transit}){
	return (
		<LayerGroup>
			<Pane name="city-border" style={{zIndex:440}}>
				<CityBoundary city={city} layer={layer}/>
			</Pane>
			{ transit &&
				<Transit city={city}/>
			}
			{ layer.name == 'Landuse' &&
				<Landuse city={city}/>
			}
			{ DaLayers.has(layer.name) &&
				<DisseminationAreas city={city} layer={layer}/>
			}
		</LayerGroup>
	)
}
