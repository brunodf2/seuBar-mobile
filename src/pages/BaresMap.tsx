import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AppLoading from 'expo-app-loading';

import mapMarker from '../images/marker.png';

import api from '../services/api';

interface BarItem {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
}

export default function BaresMap() {
	const navigation = useNavigation();
	const [bars, setBars] = useState<BarItem[]>([]);
	const [isLatitude, setIsLatitude] = useState(0);
	const [isLongitude, setIsLongitude] = useState(0);
	const [errorMsg, setErrorMsg] = useState<string>('');

	useEffect(
		() => {
			handleMyLocalization();
			console.log('LOC', isLatitude);
		},
		[isLatitude, isLongitude]
	);

	useFocusEffect(() => {
		api.get('bares').then((response) => {
			setBars(response.data);
		});
	});

	async function handleMyLocalization() {
		let { status } = await Location.requestPermissionsAsync();
		if (status !== 'granted') {
			setErrorMsg('Permission to access location was denied');
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		const { latitude, longitude } = location.coords;

		console.log(location.coords);
		console.log(typeof latitude === 'number');
		setIsLatitude(latitude);
		setIsLongitude(longitude);
	}

	function handleNavigateBarDetails(id: number) {
		navigation.navigate('BaresDetails', { id });
	}

	if (!isLatitude) {
		return (
			<View style={styles.containerIndicator}>
				<ActivityIndicator size="large" color="#f00" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				initialRegion={{

					latitude: isLatitude,
					longitude: isLongitude,
					latitudeDelta: 0.008,
					longitudeDelta: 0.008
				}}
			>
				{bars.map((bar) => {
					return (
						<Marker
							key={bar.id}
							icon={mapMarker}
							calloutAnchor={{
								x: 2.4,
								y: 0.9
							}}
							coordinate={{
								latitude: bar.latitude,
								longitude: bar.longitude
							}}
						>
							<Callout tooltip onPress={() => handleNavigateBarDetails(bar.id)}>
								<View style={styles.calloutContainer}>
									<Text style={styles.calloutText}>{bar.name}</Text>
								</View>
							</Callout>
						</Marker>
					);
				})}
			</MapView>

			<View style={styles.footer}>
				<Text style={styles.footerText}>{bars.length} Bares encontrados</Text>

				<TouchableOpacity
					style={styles.createBarButton}
					onPress={() => navigation.navigate('SelectMapPosition')}
				>
					<Feather name="plus" color="#FFF" size={30} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	containerIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height
	},

	calloutContainer: {
		width: 160,
		height: 46,
		paddingHorizontal: 16,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		borderRadius: 15,
		borderWidth: 1,
		borderColor: '#777',
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 3
	},

	calloutText: {
		color: '#f00',
		fontSize: 16,
		fontWeight: 'bold'
	},

	footer: {
		position: 'absolute',
		left: 24,
		right: 24,
		bottom: 32,

		backgroundColor: '#fff',
		borderRadius: 20,
		height: 56,
		paddingLeft: 24,

		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',

		elevation: 3
	},

	footerText: {
		color: '#8fa7b3',
		fontWeight: 'bold'
	},

	createBarButton: {
		width: 56,
		height: 56,
		backgroundColor: '#f00',
		borderRadius: 20,

		justifyContent: 'center',
		alignItems: 'center'
	}
});
