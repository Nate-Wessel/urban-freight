import React from "react";
import { render } from 'react-dom';
import "@babel/polyfill";
import { Avoid } from './Avoid'
import { Shift } from './Shift'
import { Improve } from './Improve'

var reactElem;
if (reactElem = document.querySelector('#avoid-container'))
	render(<Avoid/>, reactElem);
else if (reactElem = document.querySelector('#shift-container'))
	render(<Shift/>, reactElem);  
else if (reactElem = document.querySelector('#improve-container'))
	render(<Improve/>, reactElem);  
