import React from 'react'
import { render } from 'react-dom'
import App from './App'

var reactElem;
if (reactElem = document.querySelector('#avoid-container')){
	render(<App paradigm="avoid"/>, reactElem)
}else if (reactElem = document.querySelector('#shift-container')){
	render(<App paradigm="shift"/>, reactElem)
}else if (reactElem = document.querySelector('#improve-container')){
	render(<App paradigm="improve"/>, reactElem)
}
