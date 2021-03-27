import React, { useState, useEffect } from 'react'
import { feature as topo2geo } from 'topojson-client'
import { LayerGroup, GeoJSON } from 'react-leaflet'
import { json } from 'd3-fetch'

const sources = {
	Toronto: {
		green: require('./data/Toronto/lu_green.topojson' ),
		industrial: require('./data/Toronto/lu_industrial.topojson' ),
		parking: require('./data/Toronto/lu_parking.topojson' ),
		retail: require('./data/Toronto/lu_retail.topojson' )
	},
	Vancouver: {
		green: require('./data/Vancouver/lu_green.topojson' ),
		industrial: require('./data/Vancouver/lu_industrial.topojson' ),
		parking: require('./data/Vancouver/lu_parking.topojson' ),
		retail: require('./data/Vancouver/lu_retail.topojson' )
	},
	Edmonton: {
		green: require('./data/Edmonton/lu_green.topojson' ),
		industrial: require('./data/Edmonton/lu_industrial.topojson' ),
		parking: require('./data/Edmonton/lu_parking.topojson' ),
		retail: require('./data/Edmonton/lu_retail.topojson' )
	}
}

export default function(props){
	return null
}
