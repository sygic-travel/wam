import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View,
	Modal,
	Text,
	Button,
	ActivityIndicator,
	Image
} from 'react-native';

import { createBoundsFromSizeAndPoint, angle360, getDistance } from './src/geo';
import { processPlaces } from './src/places';

const { DeviceEventEmitter } = require('react-native');
const ReactNativeHeading = require('react-native-heading');

import PlaceDetailedModal from './Modal';
import FullScreenCamera from './Camera';
import { Marker } from './Marker';
import * as SygicTravelSDK from 'sygic-travel-js-sdk';

const apiUrl: string = 'https://api.sygictraveldata.com/0.2/en/';
const apiKey = 'n25naja6njhph9zb1jzpnt34yab0k383';
const stSDK = SygicTravelSDK.create(apiUrl);
stSDK.setUserSession(apiKey);

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

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
			modalOpened: false,
			zoom: 0,
			placeDetailed: null
		};

		this.watchID = null;
	}

	onSwipeUp(gestureState) {
		if (this.state.zoom > 0) {
			this.setState({zoom: this.state.zoom - 1});
			this.setState({
				places: processPlaces(this.state.placesData, this.state.zoom - 1, this.state.heading),
				zoom: this.state.zoom - 1
			});
		}
	}

	onSwipeDown(gestureState) {
		if (this.state.zoom < 2) {
			this.setState({zoom: this.state.zoom + 1});
			this.setState({
				places: processPlaces(this.state.placesData, this.state.zoom + 1, this.state.heading),
				zoom: this.state.zoom + 1
			});
		}
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
			stSDK.getPlaces({bounds: bounds, level: 'poi', limit: 50}).then((places) => {
				let processedPlaces = places.map((place) => ({
					angle: angle360(location.lng, location.lat, place.location.lng, place.location.lat),
					place: place,
					distance: getDistance(location, place.location)
				}));
				this.setState({placesData: processedPlaces});
				// console.log('YEAH', this.state);
			});
		});

		this.watchID = navigator.geolocation.watchPosition((position) => {
			//console.log('new position', position);
			const location = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			const placesData = this.state.placesData.map((pd) => ({
				angle: angle360(location.lng, location.lat, pd.place.location.lng, pd.place.location.lat),
				place: pd.place,
				distance: getDistance(location, pd.place.location)
			}));
			this.setState({
				placesData: placesData,
				places: processPlaces(placesData, this.state.zoom, this.state.heading),
				zoom: this.state.zoom
			});
		}, null, {
			enableHighAccuracy: true,
			maximumAge: 5000,
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
			this.setState({
				places: processPlaces(this.state.placesData, this.state.zoom, data.heading),
				heading: data.heading
			});
			console.log('SSSS', this.state);
		});
	}

	componentWillUnmount() {
		ReactNativeHeading.stop();
		DeviceEventEmitter.removeAllListeners('headingUpdated');
	}

	async getPlaceDetailedForModal(id) {
		this.setState({
			modalOpened: true
		});

		const placeDetailed = await stSDK.getPlaceDetailed(id, '500x300');
		this.setState({
			placeDetailed: placeDetailed
		});
	}

	render() {

		const swipeConfig = {
			velocityThreshold: 0.3,
			directionalOffsetThreshold: 80
		};

		return (
			<GestureRecognizer
				config={swipeConfig}
				onSwipeUp={(state) => this.onSwipeUp(state)}
				onSwipeDown={(state) => this.onSwipeDown(state)}
				style={{
					flex: 1
				}}
			>
			<View style={styles.container}>
				<FullScreenCamera />
				<View style={styles.markerStrip} onPress={() => console.log(place.place.id)}>
					{ this.state.places.map((place) => {
						if (place.displayMargin !== null) {
							return (
								<Marker
									markerSize={place.markerSize}
									key={place.place.id}
									offset={place.displayMargin}
									distance={place.distance}
									place={place.place}
									onMarkerPress={(id) => this.getPlaceDetailedForModal(id)}/>
							)
						}
					})
					}
				</View>
				{ this.state.modalOpened &&
					<PlaceDetailedModal placeDetailed={this.state.placeDetailed} onClosePress={() => this.setState({
						modalOpened: false,
						placeDetailed: null
					})}/>
				}
			</View>
			</GestureRecognizer>
		);
	}
}
AppRegistry.registerComponent('wam', () => wam);

