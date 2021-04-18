import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import { App } from './App'
const FuelChart = lazy(()=>import('./FuelChart'))


var mapElem, chartElem

if (mapElem = document.querySelector('#avoid-container')){
	render(<App paradigm="avoid"/>, mapElem)
}else if (mapElem = document.querySelector('#shift-container')){
	render(<App paradigm="shift"/>, mapElem)
}else if (mapElem = document.querySelector('#improve-container')){
	render(<App paradigm="improve"/>, mapElem)
}

if (chartElem = document.querySelector('#fuel-container')){
	render(<Suspense fallback={null}><FuelChart/></Suspense>, chartElem)
}
