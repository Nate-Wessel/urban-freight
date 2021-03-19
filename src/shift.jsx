import React from 'react'
import { render } from 'react-dom'
import Map from './Map'

render( <App/>, document.querySelector('#root') )

function App(props){
	return (
		<div>
			<h1>This is the SHIFT map</h1>
			<Map/>
		</div>
	)
}
