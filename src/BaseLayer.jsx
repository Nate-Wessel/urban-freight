import React from 'react'
import { LayerGroup } from 'react-leaflet'
import DisseminationAreas from './DisseminationAreas'
import CityBoundary from './CityBoundary'
import Landuse from './Landuse'

export default function(props){
	const { layer, city } = props
	return (
		<LayerGroup>
			<CityBoundary city={city} layer={layer}/>
			{ layer.name == 'Landuse' &&
				<Landuse city={city}/>
			}
			{ layer.name != 'Landuse' &&
				<DisseminationAreas city={city} layer={layer}/>
			}
		</LayerGroup>
	)
}
