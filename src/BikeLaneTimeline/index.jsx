import React, { useEffect, useState } from 'react'

const API = 'https://api.ee.namara.io/twirp/query.QueryService/Query'
const headers = new Headers({
	'X-API-Key': '1810451d142aec081b71013f85c0e5aca567ab9123cba182ba03dcc75950e8c2',
	'Content-type': 'application/json'
})
const data = { 
	statement: "SELECT geometry FROM a93d93b2-afeb-44da-a2b5-75bedf49297c LIMIT 100"
} 

export default function(){
	const [ response, setResponse ] = useState({})
	useEffect(()=>{
		fetch( API, {
			method:'POST',
			headers, 
			body: JSON.stringify(data)
		} ).then(console.log)
	},[])
	return 'test'
}
