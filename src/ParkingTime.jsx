import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'

const data = {
	Toronto: require('./data/Toronto/ignition.topojson'),
	Edmonton: require('./data/Edmonton/ignition.topojson'),
	Vancouver: require('./data/Vancouver/ignition.topojson')
}

export default function(props){
	const { city } = props
	const [ points, setPoints ] = useState([])
	useEffect(()=>{
		json(data[city.name]).then( resp => {
			setPoints( topo2geo(resp,'ignition').features )
		} )
	},[city])
	console.log(points)
	return ( 
		null
	)
}
