import fetch from 'node-fetch'

// as long as the last query was, wait twice that long for the next one
var lastQueryTime = 0

export async function queryOverpass(querytext){
	const options = { 
		method: 'post',
		headers: { 'content-type': 'application/x-www-form-urlencoded'},
		body: new URLSearchParams({ data: querytext }).toString()
	};
	console.log('Waiting',(2*lastQueryTime)/1000,'seconds before next query')
	await new Promise(resolve => setTimeout(resolve, 2*lastQueryTime));
	let start = Date.now()
	return fetch('https://overpass-api.de/api/interpreter',options)
		.then( response => {
			lastQueryTime = Date.now() - start
			console.log('query took',lastQueryTime/1000,'seconds')
			return response
		} )
}
