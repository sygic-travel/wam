import React, { Component } from 'react';
import {
	View,
	Image,
	TouchableHighlight
} from 'react-native';

const markers = ['destination-archipelago', 'destination-city', 'destination-continent', 'destination-country', 'destination-county', 'destination-hamlet', 'destination-island', 'destination-locality', 'destination-municipality', 'destination-neighbourhood', 'destination-region', 'destination-settlement', 'destination-state', 'destination-town', 'destination-village', 'discovering-art_centre', 'discovering-gallery-art', 'discovering-gallery', 'discovering-garden-botanical', 'discovering-garden-tropical', 'discovering-museum', 'discovering-observatory', 'discovering-planetarium', 'discovering-theatre', 'discovering-university', 'discovering-zoo-aquarium-sea_world', 'discovering-zoo-aquarium', 'discovering-zoo-safari', 'discovering-zoo', 'discovering', 'eating-cafe-starbucks', 'eating-cafe', 'eating-restaurant-asian', 'eating-restaurant-burgers-burger_king', 'eating-restaurant-burgers', 'eating-restaurant-fastfood-kfc', 'eating-restaurant-fastfood-mcdonalds', 'eating-restaurant-fastfood-tacos-taco_bell', 'eating-restaurant-fastfood', 'eating-restaurant-italian', 'eating-restaurant-mexican', 'eating-restaurant-pizza-pizza_hut', 'eating-restaurant-pizza', 'eating-restaurant', 'eating', 'going_out-bar', 'going_out-cabaret', 'going_out-casino', 'going_out-cinema', 'going_out-circus', 'going_out-club-dance', 'going_out-club-music', 'going_out-opera', 'going_out-pub', 'going_out-wine_bar', 'going_out', 'hiking-bbq', 'hiking-cave', 'hiking-forest', 'hiking-hill', 'hiking-lake', 'hiking-mountains', 'hiking-park-nature', 'hiking-park', 'hiking-picnic_site', 'hiking-rock', 'hiking-valley', 'hiking-volcano', 'hiking-waterfall', 'hiking', 'other-atm', 'other-bank', 'other-cemetery', 'other-doctor-dentist', 'other-doctor-hospital', 'other-doctor', 'other-dog_park', 'other-drinking_water', 'other-emergency-fire', 'other-emergency-police', 'other-hairdresser', 'other-information-board', 'other-information-guidepost', 'other-information-office', 'other-information', 'other-pharmacy', 'other-place_of_worship-chapel', 'other-place_of_worship-church', 'other-place_of_worship-monastery', 'other-place_of_worship-mosque', 'other-place_of_worship-shrine', 'other-place_of_worship-synagogue', 'other-place_of_worship-temple', 'other-place_of_worship', 'other-post-box', 'other-post-office', 'other-school', 'other-toilets', 'other', 'place', 'playing-park-theme-disney', 'playing-park-theme', 'playing-park-water', 'playing-playground-indoor', 'playing-playground-sand_pit', 'playing-playground', 'playing', 'relaxing-beach', 'relaxing-park-garden', 'relaxing-park', 'relaxing-sauna', 'relaxing-spa', 'relaxing', 'shopping-bakery', 'shopping-bookshop', 'shopping-butcher', 'shopping-centre', 'shopping-clothes', 'shopping-convenience_store', 'shopping-deli-candy', 'shopping-deli', 'shopping-electronics-apple', 'shopping-electronics', 'shopping-florist', 'shopping-ice_cream', 'shopping-jewelery', 'shopping-kiosk', 'shopping-market-fish', 'shopping-market', 'shopping-shoes', 'shopping-supermarket-lidl', 'shopping-supermarket-tesco', 'shopping-supermarket', 'shopping-toys', 'shopping', 'sightseeing-archeological_site', 'sightseeing-architecture-modern', 'sightseeing-art-artwork', 'sightseeing-brewery', 'sightseeing-castle', 'sightseeing-chateau', 'sightseeing-fort', 'sightseeing-fountain', 'sightseeing-library', 'sightseeing-lighthouse', 'sightseeing-marina', 'sightseeing-memorial', 'sightseeing-mill-Windmill', 'sightseeing-monument', 'sightseeing-palace', 'sightseeing-place_of_worship-church', 'sightseeing-ruins', 'sightseeing-sculpture', 'sightseeing-tower', 'sightseeing', 'sleeping-apartment-chalet', 'sleeping-apartment-guest_accommodation', 'sleeping-apartment-residence', 'sleeping-apartment', 'sleeping-campsite', 'sleeping-hostel', 'sleeping-hotel-motel', 'sleeping-hotel-resort', 'sleeping-hotel-ryokan', 'sleeping-hotel', 'sleeping', 'sports-bat', 'sports-bicycle_rental', 'sports-centre', 'sports-field-soccer', 'sports-field', 'sports-football', 'sports-golf-minigolf', 'sports-golf', 'sports-horse', 'sports-pool-indoor', 'sports-pool-outdoor', 'sports-pool', 'sports-stadium', 'sports-tennis', 'sports-winter-ice_hockey', 'sports-winter-ice_rink', 'sports', 'traveling-airport-airfield', 'traveling-airport-helipad', 'traveling-airport', 'traveling-cable_car', 'traveling-car_rental', 'traveling-ferry_terminal', 'traveling-fuel-car_charging', 'traveling-fuel-gas_station', 'traveling-fuel', 'traveling-parking', 'traveling-station-bus', 'traveling-station-subway', 'traveling-station-train-tram', 'traveling-station-train', 'traveling-station', 'traveling-taxi_stand', 'traveling'];
const markersColorClasses = ['custom', 'custom-full', 'discovering', 'discovering-full', 'dating', 'eating-full', 'going_out', 'going_out-full', 'hiking', 'hiking-full', 'playing', 'playing-full', 'relaxing', 'relaxing-full', 'sleeping', 'sleeping-full', 'shopping', 'shopping-full', 'sightseeing', 'sightseeing-full', 'sports', 'sports-full', 'traveling', 'traveling-full'];
const classToColorMap = {
	'color-custom': '#9c27b0',
	'color-custom-full': '#9c27b0',
	'color-discovering': '#a9b8d4',
	'color-discovering-full': '#7188b7',
	'color-eating': '#f79d77',
	'color-eating-full': '#f15e1e',
	'color-going-out':'#ea77aa',
	'color-going-out-full': '#db2572',
	'color-hiking': '#daa576',
	'color-hiking-full': '#c2691a',
	'color-playing': '#76dcf7',
	'color-playing-full': '#1dc7f2',
	'color-relaxing': '#aa76f7',
	'color-relaxing-full': '#7131f2',
	'color-sleeping': '#acd174',
	'color-sleeping-full': '#76b216',
	'color-shopping': '#eaae1e',
	'color-shopping-full': '#e09e00',
	'color-sightseeing': '#f78077',
	'color-sightseeing-full': '#f22c1c',
	'color-sports': '#74bb82',
	'color-sports-full': '#148e30',
	'color-traveling': '#779bf6',
	'color-traveling-full': '#1e59f2'
};

const sizes = {
	'big': 60,
	'medium': 40,
	'small': 10
};

const getMarkerStyles = (offset, markerSize, markerColor) => {
	if (!markerColor) {
		markerColor = '#999999';
	}
	return {
		//marginLeft: offset + '%',
		backgroundColor: markerColor,
		height: sizes[markerSize],
		width: sizes[markerSize],
		borderRadius: 50,
		position: 'absolute',
		top: -1 * sizes[markerSize],
		zIndex: sizes[markerSize],
	}
};

const getProperMarkerIcon = (marker) => {
	marker = marker.replace(/:/g, '-');
	while(marker.length) {
		if (markers.indexOf(marker) !== -1) {
			if(marker === 'default') {
				return 'place';
			} else {
				return marker;
			}
		}
		marker = marker.substring(0, marker.lastIndexOf('-'));
	}
	return 'place'
};

const getProperMarkerColorClass = (marker) => {
	marker = marker.replace(/:/g, '-');
	while(marker.length) {
		if (markersColorClasses.indexOf(marker) !== -1) {
			if(marker === 'default') {
				return 'color-custom';
			} else {
				return 'color-' + marker;
			}
		}
		marker = marker.substring(0, marker.lastIndexOf('-'));
	}
	return 'color-custom';
};

export class Marker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			markerUrl: getProperMarkerIcon(props.place.marker),
			markerColor: classToColorMap[getProperMarkerColorClass(props.place.marker)]
		};
	}

	render() {
		return (
			<View style={{
				left: this.props.offset + '%',
				position: 'absolute'
			}}>
				<TouchableHighlight onPress={() => this.props.onMarkerPress(this.props.place.id)}>
					<View style={getMarkerStyles(this.props.offset, this.props.markerSize, this.state.markerColor)}>
						<Image source={{
							uri:`https://cdn.travel.sygic.com/web/markers/${this.state.markerUrl}.png`}}
						       style={{width: sizes[this.props.markerSize], height: sizes[this.props.markerSize], zIndex: 10}}>
						</Image>
					</View>
				</TouchableHighlight>
			</View>
		)
	}
}
