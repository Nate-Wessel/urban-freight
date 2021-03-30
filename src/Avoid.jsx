import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import { feature as topo2geo } from 'topojson-client'

const data = {
	Toronto: {
		fedex: require('./data/Toronto/fedex.topojson'),
		purolator: require('./data/Toronto/puralator.topojson'),
		penguin: require('./data/Toronto/penguin.topojson'),
		ups: require('./data/Toronto/ups.topojson')
	},
	Edmonton: {
		fedex: require('./data/Edmonton/fedex.topojson'),
		purolator: require('./data/Edmonton/puralator.topojson'),
		penguin: require('./data/Edmonton/penguin.topojson'),
		ups: require('./data/Edmonton/ups.topojson')
	},
	Vancouver: {
		fedex: require('./data/Vancouver/fedex.topojson'),
		purolator: require('./data/Vancouver/puralator.topojson'),
		penguin: require('./data/Vancouver/penguin.topojson'),
		ups: require('./data/Vancouver/ups.topojson')
	}
}

export default function(props){
	const { city } = props
	const [ fedex, setFedex ] = useState(null)
	const [ purolator, setPurolator ] = useState(null)
	const [ penguin, setPenguin ] = useState(null)
	const [ ups, setUps ] = useState(null)
	useEffect(()=>{
		json(data[city.name].fedex) 
			.then( d=> setFedex( topo2geo(d,'fedex') ) )
		json(data[city.name].purolator) 
			.then( d=> setPurolator( topo2geo(d,'puralator') ) ) // typo
		json(data[city.name].penguin) 
			.then( d=> setPenguin( topo2geo(d,'penguin') ) )
		json(data[city.name].ups) 
			.then( d=> setUps( topo2geo(d,'ups') ) )
	},[city])
	return null
}
