import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View
} from 'react-native';

import { createBoundsFromSizeAndPoint, angle360, getDistance } from './src/geo';

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
			stSDK.getPlaces({bounds: bounds, level: 'poi', limit: 100}).then((places) => {
				let processedPlaces = places.map((place) => ({
					angle: angle360(location.lng, location.lat, place.location.lng, place.location.lat),
					place: place,
					distance: getDistance(location, place.location)
				}));
				this.setState({placesData: processedPlaces});
				console.log('YEAH', this.state);
			});
		});

		ReactNativeHeading.start(1)
			.then(didStart => {
				this.setState({
					headingIsSupported: didStart,
				});
			});

		DeviceEventEmitter.addListener('headingUpdated', data => {
			if (this.state.heading !== null && Math.abs(this.state.heading - data.heading) < 0.5) {
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

				if (placeData.distance <= 200) {
					placeData.markerSize = 'big';
				} else if (placeData.distance <= 500) {
					placeData.markerSize = 'medium';
				} else {
					placeData.markerSize = 'small';
				}


				return placeData;
			});
			this.setState({places: places});
			console.log('SSSS', this.state);
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
					{ this.state.places.map((place) => {
						if (place.displayMargin !== null) {
							return (
								<Marker markerSize={place.markerSize} key={place.place.id} offset={place.displayMargin} distance={place.distance} place={place.place} />
							)
						}
					})
					}

				</View>
			</View>
		);
	}
}
AppRegistry.registerComponent('wam', () => wam);

