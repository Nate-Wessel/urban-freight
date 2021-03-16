import React from 'react'
import { render } from 'react-dom'

render( <App/>, document.querySelector('#root') )

function App(props){
	return <h1>Hello World!</h1>
}
