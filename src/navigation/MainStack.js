import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CurrencyDetailsScreen from '../screens/CurrencyDetailsScreen'; // Yeni ekran
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#007bff', // Örnek başlık rengi
                },
                headerTintColor: '#fff', // Örnek başlık metin rengi
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Döviz Kurları',
                    headerRight: () => (
                        <IconButton
                            icon={({ color }) => <Icon name="info" color={color} size={24} />}
                            onPress={() => {
                                // Hakkında ekranına yönlendirme veya bilgi gösterme
                                alert('Uygulama Hakkında');
                            }}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="CurrencyDetails"
                component={CurrencyDetailsScreen}
                options={({ route }) => ({
                    title: route.params.currency,
                })}
            />
            {/* Diğer ekranlar buraya eklenebilir */}
        </Stack.Navigator>
    );
};

export default MainStack;