import React, { lazy, Suspense } from 'react'
const Avoid = lazy(()=>import('./Avoid'))
const Shift = lazy(()=>import('./Shift'))
const Improve = lazy(()=>import('./Improve'))

export default function (props){
	const { city, paradigm, zoom, displayed } = props
	switch(paradigm){
		case 'avoid':
			return (
				<Suspense fallback={null}>
					<Avoid city={city} zoom={zoom} displayed={displayed}/>
				</Suspense>
			)
		case 'shift':
			return (
				<Suspense fallback={null}>
					<Shift city={city} displayed={displayed}/>
				</Suspense>
			)
		case 'improve': 
			return (
				<Suspense fallback={null}>
					<Improve city={city} displayed={displayed}/>
				</Suspense>
			)
	}
	return null
}
