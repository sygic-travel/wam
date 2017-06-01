export function processPlaces(placesData, zoom, heading) {

	console.log(zoom, heading);
	let bottom = heading - 15;
	if (bottom < 0) {
		bottom = 360 - bottom;
	}
	const top = heading + 15;
	return placesData.map((placeData) => {
		if (placeData.angle >= bottom && placeData.angle <= top) {
			let angleDistance = placeData.angle - bottom;
			if (angleDistance < 0) {
				angleDistance = angleDistance - 360;
			}
			placeData.displayMargin = Math.round((angleDistance / 30) * 100);
		} else {
			placeData.displayMargin = null;
		}

		if (placeData.distance <= 200) {
			placeData.markerSize = 'big';
			if (zoom > 0) {
				placeData.displayMargin = null;
			}
		} else if (placeData.distance <= 500) {
			placeData.markerSize = 'medium';
			if (zoom > 0) {
				placeData.markerSize = 'big';
			}
			if (zoom > 1) {
				placeData.displayMargin = null;
			}
		} else {
			placeData.markerSize = 'small';
			if (zoom > 0) {
				placeData.markerSize = 'medium';
			}
			if (zoom > 1) {
				placeData.markerSize = 'big';
			}
		}

		return placeData;
	});
}