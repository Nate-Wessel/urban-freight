export async function getBikeLanes(city){
	return import(`./${city.name}/shift/bike.topojson`)
		.then( module => fetch(module.default) )
		.then( response => response.json() )
		.catch( err => console.warn('bike lanes not available') )
}
