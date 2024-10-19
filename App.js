import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen'; // Doğru yol

export default function App() {
return (
<SafeAreaProvider>
<PaperProvider>
<HomeScreen />
</PaperProvider>
</SafeAreaProvider>
);
}