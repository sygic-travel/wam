import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View
} from 'react-native';

import BadInstagramCloneApp from './Camera';
const { DeviceEventEmitter } = require('react-native');
const ReactNativeHeading = require('react-native-heading');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
	},
	canvas: {
		position: 'absolute',
		height: '100%',
		width: '100%'
	}
});

export default class wam extends Component {
	componentDidMount() {
		ReactNativeHeading.start(1)
			.then(didStart => {
				this.setState({
					headingIsSupported: didStart,
				})
			})

		DeviceEventEmitter.addListener('headingUpdated', data => {
			console.log('New heading is:', data.heading);
		});

	}
	componentWillUnmount() {
		ReactNativeHeading.stop();
		DeviceEventEmitter.removeAllListeners('headingUpdated');
	}
	render() {
		return (
			<View style={styles.container}>
				<BadInstagramCloneApp />
			</View>
		);
	}
}
AppRegistry.registerComponent('wam', () => wam);
