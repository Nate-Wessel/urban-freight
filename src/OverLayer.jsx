import React, { lazy, Suspense } from 'react'
import Avoid from './Avoid'

export default function (props){
	const { city, paradigm } = props
	switch(paradigm){
		case 'avoid':
			return <Avoid city={city}/>
		case 'shift':
			return <Shift city={city}/>
		case 'improve': 
			return <Improve city={city}/>
	}
	return null
}


function Shift(props){
	const { city } = props
	return null
}
function Improve(props){
	const { city } = props
	return null
}
