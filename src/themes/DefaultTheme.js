import { DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const lightTheme = {
    ...PaperDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        primary: '#007bff',
        accent: '#f44336',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#333333',
        error: '#f44336',
        success: '#4caf50',
        warning: '#ff9800',
        info: '#2196f3',

    },

    fonts: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        light: 'Roboto-Light',
        thin: 'Roboto-Thin',
    },
    animation: {
        scale: 1.0,
    },

};


const darkTheme = {
    ...PaperDarkTheme,

    colors: {
        ...PaperDarkTheme.colors,
        primary: '#2196f3',
        accent: '#f44336',
        background: '#121212',
        surface: '#212121',
        text: '#ffffff',
        error: '#f44336',
        success: '#4caf50',
        warning: '#ff9800',
        info: '#2196f3',

    },
    fonts: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        light: 'Roboto-Light',
        thin: 'Roboto-Thin',
    },
    animation: {
        scale: 1.0,
    },


};



const loadTheme = async () => {

    try {

        const storedTheme = await AsyncStorage.getItem('theme');


        if (storedTheme) {


            return storedTheme === 'dark' ? darkTheme : lightTheme;


        }


    } catch (error) {


        console.error("Tema yüklenirken hata:", error);


    }



    return Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;


};



const saveTheme = async (theme) => {

    try {


        await AsyncStorage.setItem('theme', theme);



    } catch (error) {


        console.error("Tema kaydedilirken hata:", error);



    }



};



export { lightTheme, darkTheme, loadTheme, saveTheme };