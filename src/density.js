import { contourDensity } from 'd3-contour'
import { geoMercator } from 'd3-geo'

// returns unprojected d3-contours
// from a dataset [list] with lat/lon properties on entries
export function density(points,LeafletMap){
	let center = LeafletMap.getCenter()
	let size = LeafletMap.getSize()
	
	const proj = geoMercator()
		.rotate( [ -center.lng, -center.lat, 0 ] )
		.translate( [ size.x/2, size.y/2 ] )
		.scale(1.5e5)

	const contours =	contourDensity()
		.x( feat => proj(feat.geometry.coordinates)[0] )
		.y( feat => proj(feat.geometry.coordinates)[1] )
		.weight( feat => feat.properties.AvgTimeToPark )
		.size([size.x,size.y])
		// log2 scale
		.thresholds([0.4,0.8,1.6,3.2,6.4,12.8])
		.bandwidth(6)
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

