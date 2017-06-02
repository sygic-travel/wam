import React, { Component } from 'react';
import {
	View,
	Modal,
	Text,
	Button,
	ActivityIndicator,
	Image,
	Linking
} from 'react-native';

export default class PlaceDetailedModal extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<View style={{marginTop: 22}}>
				<Modal
					animationType={"slide"}
					transparent={false}
				>
					<View style={{marginTop: 22}}>
						<View>
							{ !this.props.placeDetailed &&
								<ActivityIndicator
									animating={true}
									style={{height: 80}}
									size="large"
								/>
							}

							{ this.props.placeDetailed &&
								<View>
									{ this.props.placeDetailed.detail.media.landscape &&
									<Image source={{ uri: this.props.placeDetailed.detail.media.landscape.urlTemplate}}
									       style={{width: '100%', height: 200}}>
									</Image>
									}
									<View style={{ padding: 10 }}>
										<Text style={{
											fontSize: 20,
											fontWeight: 'bold'
										}}>{this.props.placeDetailed.name}</Text>
										<Text>
											{this.props.placeDetailed.perex}
										</Text>
									</View>
								</View>
							}
							<Button
								onPress={() => {
									Linking.openURL('https://travel.sygic.com/go/' + this.props.placeDetailed.id);
								}}
								title="GO!"
								color="#0077FF"
							/>

							<Button
								onPress={() => this.props.onClosePress()}
								title="Close"
								color="#841584"
							/>
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}
