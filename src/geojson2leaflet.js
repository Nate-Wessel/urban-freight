import { GeoJSON } from 'leaflet'

export function geojson2leaflet(geometry){
	switch(geometry.type){
		case 'LineString':
			return GeoJSON.coordsToLatLngs(geometry.coordinates,0)
		case 'MultiLineString':
			return GeoJSON.coordsToLatLngs(geometry.coordinates,1)
		case 'Point':
			return GeoJSON.coordsToLatLng(geometry.coordinates)
		case 'Polygon':
			return GeoJSON.coordsToLatLngs(geometry.coordinates,1)
		case 'MultiPolygon':
			return GeoJSON.coordsToLatLngs(geometry.coordinates,2)
		default:
			console.warn('geometry type not yet handled:',geometry)
	}
}
