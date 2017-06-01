import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	View
} from 'react-native';
import BadInstagramCloneApp from './Camera';

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
	render() {
		return (
			<View style={styles.container}>
				<BadInstagramCloneApp />
			</View>
		);
	}
}
AppRegistry.registerComponent('wam', () => wam);
