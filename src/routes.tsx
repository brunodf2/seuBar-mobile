import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import BaresMap from './pages/BaresMap';
import BaresDetails from './pages/BaresDetails';
import RegisterBar from './pages/RegisterBar';
import SelectMapPosition from './pages/SelectMapPosition';
import Header from './components/Header';

export default function Routes() {
	return (
		<NavigationContainer>
			<Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f2f3f5' } }}>
				<Screen name="BaresMap" component={BaresMap} />
				<Screen
					name="BaresDetails"
					component={BaresDetails}
					options={{
						headerShown: true,
						header: () => <Header showCancel={false} title="Informações" />
					}}
				/>
				<Screen
					name="RegisterBar"
					component={RegisterBar}
					options={{
						headerShown: true,
						header: () => <Header title="Cadastre-se" />
					}}
				/>
				<Screen
					name="SelectMapPosition"
					component={SelectMapPosition}
					options={{
						headerShown: true,
						header: () => <Header title="Selecione no mapa" />
					}}
				/>
			</Navigator>
		</NavigationContainer>
	);
}
