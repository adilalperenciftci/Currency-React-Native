import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';
import { ToastAndroid } from 'react-native';



const CurrencyItem = ({ currency, rate, isFavorite, toggleFavorite, onLongPress }) => {
    const theme = useTheme();

    const handleShare = async () => {
        try {
            const shareContent = `${currency}: ${rate}`;
            await Share.share({
                message: shareContent,
            });
        } catch (error) {
            console.error("Paylaşım hatası:", error);
            ToastAndroid.show("Paylaşım hatası", ToastAndroid.SHORT);

        }
    };


    const handleCopy = async () => {
        try {

            await Clipboard.setStringAsync(`${currency}: ${rate}`);

            ToastAndroid.show("Kopyalandı!", ToastAndroid.SHORT);

        } catch (error) {
            console.error("Kopyalama hatası:", error);
            ToastAndroid.show("Kopyalama hatası", ToastAndroid.SHORT);

        }
    };



    return (
        <TouchableOpacity
            onLongPress={() => {
                onLongPress(currency);
                handleCopy();

            }}


        >
            <Card style={[styles.currencyCard, { backgroundColor: theme.colors.surface }]} mode='outlined' >
                <Card.Content style={styles.cardContent}>
                    <View style={styles.currencyInfo}>
                        <Text style={[styles.currencyTitle, { color: theme.colors.text }]}>{currency}</Text>
                        <Text style={[styles.currencyRate, { color: theme.colors.text }]}>{rate}</Text>

                    </View>
                    <View style={styles.iconContainer}>
                        <IconButton
                            icon={({ color }) => <Icon name={isFavorite ? "star" : "star-outline"} color={color} size={30} />}
                            iconColor={isFavorite ? "gold" : "grey"}
                            size={30}
                            onPress={() => toggleFavorite(currency)}
                        />
                        <IconButton
                            icon={({ color }) => <Icon name="share" color={color} size={30} />}
                            iconColor={theme.colors.primary}
                            size={30}
                            onPress={handleShare}

                        />
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    currencyCard: {
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },

    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },

    currencyInfo: {

        flex: 1,

    },

    currencyTitle: {
        fontSize: 18,

        fontWeight: 'bold',


    },

    currencyRate: {
        fontSize: 16,

    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});


export default memo(CurrencyItem);