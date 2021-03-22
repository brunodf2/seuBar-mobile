import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

interface BarDataRouteParams {
	position: { latitude: number; longitude: number };
}

export default function RegisterBar() {
	const route = useRoute();
	const navigation = useNavigation();

	const [name, setName] = useState('');
	const [sobre, setSobre] = useState('');
	const [horaFuncionamento, setHoraFuncionamento] = useState('');
	const [aberto, setAberto] = useState(true);
	const [images, setImages] = useState<string[]>([]);

	const params = route.params as BarDataRouteParams;

	async function handleCreateBar() {
		const { latitude, longitude } = params.position;

		const data = new FormData();

		data.append('name', name);
		data.append('latitude', String(latitude));
		data.append('longitude', String(longitude));
		data.append('sobre', sobre);
		data.append('horario_de_funcionamento', horaFuncionamento);
		data.append('aberto', String(aberto));

		images.forEach((image, index) =>
			data.append('images', {
				name: `image_${index}.jpg`,
				type: 'image/jpg',
				uri: image
			} as any)
		);

		await api.post('bares', data)

		navigation.navigate('BaresMap')
	}

	async function handleSelectImages() {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== 'granted') {
			alert('Eita! Precisamos de acesso às suas fotos...');
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
			mediaTypes: ImagePicker.MediaTypeOptions.Images
		});

		if (result.cancelled) {
			return;
		}

		const { uri: image } = result;

		setImages([...images, image]);

		console.log(result);
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
			<Text style={styles.title}>Dados</Text>

			<Text style={styles.label}>Nome</Text>
			<TextInput style={styles.input} value={name} onChangeText={setName} />

			<Text style={styles.label}>Sobre</Text>
			<TextInput style={[styles.input, { height: 110 }]} multiline value={sobre} onChangeText={setSobre} />

			<Text style={styles.label}>Fotos</Text>
			<View style={styles.uploadedImagesConatiner}>
				{images.map((image) => {
					return <Image key={image} source={{ uri: image }} style={styles.uploadedImage} />;
				})}
			</View>

			{/* <Text style={styles.label}>Whatsapp</Text>
			<TextInput
				style={styles.input}
			/> */}

			<TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
				<Feather name="plus" size={24} color="#15B6D6" />
			</TouchableOpacity>

			<Text style={styles.label}>Horario de funcionamento</Text>
			<TextInput placeholder="Ex: Segunda à Domingo das 12hs as 20hs" style={styles.input} value={horaFuncionamento} onChangeText={setHoraFuncionamento} />

			<View style={styles.switchContainer}>
				<Text style={styles.label}>Atende final de semana?</Text>
				<Switch
					thumbColor="#fff"
					trackColor={{ false: '#ccc', true: '#39CC83' }}
					value={aberto}
					onValueChange={setAberto}
				/>
			</View>

			<RectButton style={styles.nextButton} onPress={handleCreateBar}>
				<Text style={styles.nextButtonText}>Cadastrar</Text>
			</RectButton>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	title: {
		color: '#5c8599',
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 32,
		paddingBottom: 24,
		borderBottomWidth: 0.8,
		borderBottomColor: '#D3E2E6'
	},

	label: {
		color: '#8fa7b3',
		fontWeight: 'bold',
		marginBottom: 8
	},

	comment: {
		fontSize: 11,
		color: '#8fa7b3'
	},

	input: {
		backgroundColor: '#fff',
		borderWidth: 1.4,
		borderColor: '#d3e2e6',
		borderRadius: 20,
		height: 56,
		paddingVertical: 18,
		paddingHorizontal: 24,
		marginBottom: 16,
		textAlignVertical: 'top',
	},

	uploadedImagesConatiner: {
		flexDirection: 'row'
	},

	uploadedImage: {
		width: 64,
		height: 64,
		borderRadius: 20,
		marginBottom: 32,
		marginRight: 8
	},

	imagesInput: {
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderStyle: 'dashed',
		borderColor: '#96D2F0',
		borderWidth: 1.4,
		borderRadius: 20,
		height: 56,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 32
	},

	switchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 16
	},

	nextButton: {
		backgroundColor: '#ff4040',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		height: 56,
		marginTop: 32
	},

	nextButtonText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#FFF'
	}
});
