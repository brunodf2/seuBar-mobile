import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import mapMarker from '../images/marker.png';

export default function BaresMap() {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: -15.824372,
					longitude: -48.094439,
					latitudeDelta: 0.008,
					longitudeDelta: 0.008
				}}
			>
				<Marker
					icon={mapMarker}
					calloutAnchor={{
						x: 2.4,
						y: 0.9
					}}
					coordinate={{
						latitude: -15.824372,
						longitude: -48.094439
					}}
				>
					<Callout tooltip onPress={() => navigation.navigate('BaresDetails')}>
						<View style={styles.calloutContainer}>
							<Text style={styles.calloutText}>Seu Zé</Text>
						</View>
					</Callout>
				</Marker>
			</MapView>

			<View style={styles.footer}>
				<Text style={styles.footerText}>2 Bares encontrados</Text>

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
