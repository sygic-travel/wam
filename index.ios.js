import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View
} from 'react-native';
const { DeviceEventEmitter } = require('react-native');
const ReactNativeHeading = require('react-native-heading');

import FullScreenCamera from './Camera';
import { Marker } from './Marker';
import * as SygicTravelSDK from 'sygic-travel-js-sdk';

const apiUrl: string = 'https://api.sygictraveldata.com/0.2/en/';
const apiKey = 'n25naja6njhph9zb1jzpnt34yab0k383';
const stSDK = SygicTravelSDK.create(apiUrl);
stSDK.setUserSession(apiKey);


const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
	},
	canvas: {
		position: 'absolute',
		height: '100%',
		width: '100%'
	},
	markerStrip: {
		position: 'absolute',
		zIndex: 10,
		top: '50%',
		width: '100%',
		height: 0,
		backgroundColor: 'green'
	}
});

export default class wam extends Component {

	constructor(props) {
		super(props);
		this.state = {
			placesData: [],
			places: [],
			heading: null,
		};
	}


	componentDidMount() {
		navigator.geolocation.getCurrentPosition( (position) => {
			//console.log('POSITION:', position);
			const location = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			const bounds = createBoundsFromSizeAndPoint(1000, 1000, location);
			//console.log('BOUNDS:', bounds);
			stSDK.getPlaces({bounds: bounds, level: 'poi', limit: 256}).then((places) => {
				console.log(places);
				let processedPlaces = places.map((place) => ({
					angle: angle360(location.lng, location.lat, place.location.lng, place.location.lat),
					place: place
				}));
				this.setState({placesData: processedPlaces});
				console.log(this.state);
			});
		});

		ReactNativeHeading.start(1)
			.then(didStart => {
				this.setState({
					headingIsSupported: didStart,
				});
			});

		DeviceEventEmitter.addListener('headingUpdated', data => {
			if (this.state.heading !== null && Math.abs(this.state.heading - data.heading) < 10) {
				return;
			}
			this.setState({heading: data.heading});
			let bottom = data.heading - 15;
			if (bottom < 0) {
				bottom = 360 - bottom;
			}
			const top = data.heading + 15;
			const places = this.state.placesData.map( (placeData) => {
				if (placeData.angle >= bottom && placeData.angle <= top) {
					let distance = placeData.angle - bottom;
					if (distance < 0) {
						distance = distance - 360;
					}
					placeData.displayMargin = Math.round((distance / 30) * 100);
				} else {
					placeData.displayMargin = null;
				}
				return placeData;
			});
			this.setState({places: places});
			// console.log('SSSS', this.state);
		});

	}

	componentWillUnmount() {
		ReactNativeHeading.stop();
		DeviceEventEmitter.removeAllListeners('headingUpdated');
	}

	render() {
		return (
			<View style={styles.container}>
				<FullScreenCamera />
				<View style={styles.markerStrip}>
					{ this.state.places.map((place) => (
						<Marker key={place.place.id} offset={place.offset} distance={place.distance} place={place.place} />
					))
					}

				</View>
			</View>
		);
	}
}
AppRegistry.registerComponent('wam', () => wam);


const createBoundsFromSizeAndPoint = function(width, height, point) {
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
};

const getPointWithOffset = function(point, distance, heading) {
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
};

function angle(cx, cy, ex, ey) {
	const dy = ey - cy;
	const dx = ex - cx;
	let theta = Math.atan2(dy, dx); // range (-PI, PI]
	theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	return theta;
}

function angle360(cx, cy, ex, ey) {
	let theta = angle(cx, cy, ex, ey); // range (-180, 180]
	if (theta < 0) {
		theta = 360 + theta;
	} // range [0, 360)
	return theta;
}
