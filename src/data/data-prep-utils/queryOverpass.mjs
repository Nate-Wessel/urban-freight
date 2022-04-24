import fetch from 'node-fetch'

export async function queryOverpass(querytext){
	const options = { 
		method: 'post',
		headers: { 'content-type': 'application/x-www-form-urlencoded'},
		body: new URLSearchParams({ data: querytext }).toString()
	};
	return fetch('https://overpass-api.de/api/interpreter',options)
}
