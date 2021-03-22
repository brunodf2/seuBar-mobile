import React, { useEffect, useState } from 'react';
import { Image, View, ScrollView, Text, StyleSheet, Dimensions, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import MapView, { Marker } from 'react-native-maps';
import { Feather, FontAwesome } from '@expo/vector-icons';

import mapMarkerImg from '../images/marker.png';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import api from '../services/api';

interface BarDetailsRouteParams {
	id: number;
}

interface Bar {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	sobre: string;
	horario_de_funcionamento: string;
	aberto: boolean;
	images: Array<{
		id: number;
		url: string;
	}>;
}

export default function BaresDetails() {
	const route = useRoute();
	const params = route.params as BarDetailsRouteParams;

	const [bar, setBar] = useState<Bar>();

	useEffect(
		() => {
			api.get(`bares/${params.id}`).then((response) => {
				setBar(response.data);
			});
		},
		[params.id]
	);

	const handleOpenGoogleMapRoutes = () => {
		Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${bar?.latitude},${bar?.longitude}`)
	}

	if (!bar) {
		return (
			<View style={styles.container}>
				<Text style={styles.description}>Carregando...</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.imagesContainer}>
				<ScrollView horizontal pagingEnabled>
					{bar.images.map((image) => {
						return <Image key={image.id} style={styles.image} source={{ uri: image.url }} />;
					})}
				</ScrollView>
			</View>

			<View style={styles.detailsContainer}>
				<Text style={styles.title}>{bar.name}</Text>
				<Text style={styles.description}>{bar.sobre}</Text>

				<View style={styles.mapContainer}>
					<MapView
						initialRegion={{
							latitude: bar.latitude,
							longitude: bar.longitude,
							latitudeDelta: 0.008,
							longitudeDelta: 0.008
						}}
						zoomEnabled={false}
						pitchEnabled={false}
						scrollEnabled={false}
						rotateEnabled={false}
						style={styles.mapStyle}
					>
						<Marker
							icon={mapMarkerImg}
							coordinate={{
								latitude: bar.latitude,
								longitude: bar.longitude
							}}
						/>
					</MapView>

					<TouchableOpacity onPress={handleOpenGoogleMapRoutes} style={styles.routesContainer}>
						<Text style={styles.routesText}>Ver rotas no Google Maps</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.separator} />

				<View style={styles.scheduleContainer}>
					<View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
						<Feather name="clock" size={40} color="#2AB5D1" />
						<Text style={[styles.scheduleText, styles.scheduleTextBlue]}>
							{bar.horario_de_funcionamento}
						</Text>
					</View>
					{bar.aberto ? (
						<View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
							<Feather name="info" size={40} color="#39CC83" />
							<Text style={[styles.scheduleText, styles.scheduleTextGreen]}>Atendemos fim de semana</Text>
						</View>
					) :
						<View style={[styles.scheduleItem, styles.scheduleItemRed]}>
							<Feather name="info" size={40} color="#ff669d" />
							<Text style={[styles.scheduleText, styles.scheduleTextRed]}>Não atendemos fim de semana</Text>
						</View>
					}
				</View>

				{/* <RectButton style={styles.contactButton} onPress={() => { }}>
					<FontAwesome name="whatsapp" size={24} color="#FFF" />
					<Text style={styles.contactButtonText}>Entrar em contato</Text>
				</RectButton> */}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	imagesContainer: {
		height: 240
	},

	image: {
		width: Dimensions.get('window').width,
		height: 240,
		resizeMode: 'cover'
	},

	detailsContainer: {
		padding: 24
	},

	title: {
		color: '#4D6F80',
		fontSize: 30,
		fontWeight: 'bold'
	},

	description: {
		fontWeight: 'bold',
		color: '#5c8599',
		lineHeight: 24,
		marginTop: 16
	},

	mapContainer: {
		borderRadius: 20,
		overflow: 'hidden',
		borderWidth: 1.2,
		borderColor: '#B3DAE2',
		marginTop: 40,
		backgroundColor: '#E6F7FB'
	},

	mapStyle: {
		width: '100%',
		height: 150
	},

	routesContainer: {
		padding: 16,
		alignItems: 'center',
		justifyContent: 'center'
	},

	routesText: {
		fontWeight: 'bold',
		color: '#0089a5'
	},

	separator: {
		height: 0.8,
		width: '100%',
		backgroundColor: '#D3E2E6',
		marginVertical: 40
	},

	scheduleContainer: {
		marginTop: 24,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},

	scheduleItem: {
		width: '48%',
		padding: 20
	},

	scheduleItemBlue: {
		backgroundColor: '#E6F7FB',
		borderWidth: 1,
		borderColor: '#B3DAE2',
		borderRadius: 20
	},

	scheduleItemGreen: {
		backgroundColor: '#EDFFF6',
		borderWidth: 1,
		borderColor: '#A1E9C5',
		borderRadius: 20
	},

	scheduleItemRed: {
		backgroundColor: '#fef6f9',
		borderWidth: 1,
		borderColor: '#ffbcd4',
		borderRadius: 20
	},

	scheduleText: {
		fontWeight: 'bold',
		fontSize: 16,
		lineHeight: 24,
		marginTop: 20
	},

	scheduleTextBlue: {
		color: '#5C8599'
	},

	scheduleTextGreen: {
		color: '#37C77F'
	},

	scheduleTextRed: {
		color: '#ffbcd4'
	},

	contactButton: {
		backgroundColor: '#3CDC8C',
		borderRadius: 20,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 56,
		marginTop: 40
	},

	contactButtonText: {
		fontWeight: 'bold',
		color: '#FFF',
		fontSize: 16,
		marginLeft: 16
	}
});
