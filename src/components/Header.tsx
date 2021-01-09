import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
	title: string;
	showCancel?: boolean;
}

export default function Header({ title, showCancel = true }: HeaderProps) {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<BorderlessButton onPress={navigation.goBack}>
				<Feather name="arrow-left" size={24} color="#f00" />
			</BorderlessButton>
			<Text style={styles.title}>{title}</Text>
			{showCancel ? (
				<BorderlessButton onPress={() => navigation.navigate('BaresMap')}>
					<Feather name="x" size={24} color="#f00" />
				</BorderlessButton>
			) : (
				<View />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 24,
		backgroundColor: '#f9fafc',
		borderBottomWidth: 1,
		borderColor: '#dde3f0',
		paddingTop: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	title: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#f00'
	}
});
