import { contourDensity } from 'd3-contour'
import { geoMercator, geoDistance } from 'd3-geo'

const size = [800,800]	
const EarthRadius = 6360e3 //6360km

// returns unprojected d3-contours
// from a dataset [list] with lat/lon properties on entries
export function density(points,city){
	let bndFeature = { 
		type: 'MultiPoint', 
		coordinates: [ // Leaflet uses [y,x] coordinates because ???
			[ city.bounds[0][1], city.bounds[0][0] ],
			[ city.bounds[1][1], city.bounds[1][0] ]
		] 
	}
	// set projection to contain city bounds
	const proj = geoMercator().fitSize( size, bndFeature )
	// determine the scale factor to convert between pixels and meters
	let pxLen = Math.sqrt(size[0]**2+size[1]**2)
	let [ A, B ] = [ proj.invert([0,0]), proj.invert(size) ]
	let mLen = geoDistance(A,B)*EarthRadius
	let m2px = pxLen/mLen
	points.map( f => [ f.x, f.y ] = proj(f.geometry.coordinates) )
	const contours = contourDensity()
		.x(f=>f.x).y(f=>f.y)
		.weight( f => f.properties.AvgTimeToPark )
		.size(size)
		.thresholds(5)
		.cellSize(1)
		.bandwidth(400*m2px) // convert meters to pixels
		( points )
	contours.map(cont => {
		cont.coordinates = unproject(cont.coordinates,proj) 
	} )
	return contours.filter( cont => cont.coordinates.length > 0 )
}

// recursively unproject geometry coordinates back to lat/lon
function unproject(coords,proj){
	// if a point convert and return
	if( coords.length==2 && !isNaN(coords[0]) ){
		return proj.invert(coords)
	}else if(Array.isArray(coords)){
		// else an array, so iterate
		return coords.map( v => unproject(v,proj) )
	}
}

