import React, { lazy, Suspense } from 'react'
const Avoid = lazy(()=>import('./Avoid'))
const Shift = lazy(()=>import('./Shift'))
const Improve = lazy(()=>import('./Improve'))

export default function (props){
	const { city, paradigm } = props
	switch(paradigm){
		case 'avoid':
			return <Suspense fallback={null}><Avoid city={city}/></Suspense>
		case 'shift':
			return <Suspense fallback={null}><Shift city={city}/></Suspense>
		case 'improve': 
			return <Suspense fallback={null}><Improve city={city}/></Suspense>
	}
	return null
}
