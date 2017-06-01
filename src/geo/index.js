export function createBoundsFromSizeAndPoint(width, height, point) {
	let a, alpha, b, c, ne, sw;

	a = width;
	b = height;
	c = Math.sqrt(a * a + b * b);
	alpha = Math.asin(b / c) * 180 / Math.PI;
	sw = getPointWithOffset(point, c, 270 - alpha);
	ne = getPointWithOffset(point, c, 90 - alpha);
	return {
		south: sw['lat'],
		west: sw['lng'],
		north: ne['lat'],
		east: ne['lng']
	};
}

export function getPointWithOffset(point, distance, heading) {
	let dR, finalLat, finalLng, latRad, lngRad;
	heading = heading * Math.PI / 180;
	latRad = point['lat'] * Math.PI / 180;
	lngRad = point['lng'] * Math.PI / 180;
	dR = distance / 6378137;
	finalLat = Math.asin(Math.sin(latRad) * Math.cos(dR) + Math.cos(latRad) * Math.sin(dR) * Math.cos(heading));
	finalLng = lngRad + Math.atan2(Math.sin(heading) * Math.sin(dR) * Math.cos(latRad), Math.cos(dR) - Math.sin(latRad) * Math.sin(finalLat));
	return {
		'lat': finalLat * 180 / Math.PI,
		'lng': finalLng * 180 / Math.PI
	};
}

export function  angle(cx, cy, ex, ey) {
	const dy = ey - cy;
	const dx = ex - cx;
	let theta = Math.atan2(dy, dx); // range (-PI, PI]
	theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	return theta;
}

export function  angle360(cx, cy, ex, ey) {
	let theta = angle(cx, cy, ex, ey); // range (-180, 180]
	if (theta < 0) {
		theta = 360 + theta;
	} // range [0, 360)
	return theta;
}

export function getDistance(point1, point2) {
	const EARTH_RADIUS = 6378137;
	const lat1 = point1.lat * Math.PI / 180;
	const lng1 = point1.lng * Math.PI / 180;
	const lat2 = point2.lat * Math.PI / 180;
	const lng2 = point2.lng * Math.PI / 180;
	return Math.round(
		Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1))
		* EARTH_RADIUS
	);
}