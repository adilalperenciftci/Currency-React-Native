import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Share } from 'react-native';
import { Card, Title, Text, IconButton, useTheme, Portal, Dialog, Paragraph, Button as PaperButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExchangeRates } from '../api/exchangeRate';

const FavoritesList = ({ favorites, onRemoveFavorite }) => {
    const theme = useTheme();
    const [selectedFavorite, setSelectedFavorite] = useState(null);
    const [favoriteRate, setFavoriteRate] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    const handleFavoritePress = async (currency) => {
        setSelectedFavorite(currency);
        try {
            const rates = await getExchangeRates('TRY', [currency]);
            setFavoriteRate(rates.conversion_rates[currency]);
            setDialogVisible(true);
        } catch (error) {
            console.error("Kur bilgisi alınırken hata:", error);
        }
    };

    const handleRemoveFavorite = (currency) => {
        Alert.alert(
            'Favoriyi Kaldır',
            `${currency} para birimini favorilerden kaldırmak istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Kaldır',
                    onPress: () => {
                        onRemoveFavorite(currency);
                        if (selectedFavorite === currency) {
                            setDialogVisible(false);
                            setSelectedFavorite(null);
                            setFavoriteRate(null);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };


    const handleShare = async () => {
        try {
            const shareContent = `${selectedFavorite}: ${favoriteRate}`;
            await Share.share({
                message: shareContent,
            });
        } catch (error) {
            console.error("Paylaşım hatası:", error);
        }
    };


    const renderFavoriteItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleFavoritePress(item)}>
            <View style={styles.favoriteItemContainer}>
                <Text style={[styles.favoriteItemText, { color: theme.colors.text }]}>{item}</Text>
                <IconButton
                    icon={({ color }) => <Icon name="close" color={color} size={20} />}
                    iconColor={theme.colors.error}
                    size={20}
                    onPress={() => handleRemoveFavorite(item)}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <Card style={[styles.favoritesContainer, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
                <Title style={[styles.favoritesTitle, { color: theme.colors.text }]}>Favoriler</Title>
                {favorites.length > 0 ? (
                    <FlatList
                        data={favorites}
                        keyExtractor={(item) => item}
                        renderItem={renderFavoriteItem}
                        horizontal
                        contentContainerStyle={styles.favoriteListContent}
                    />
                ) : (
                    <Text style={{ textAlign: 'center', color: theme.colors.disabled, marginVertical: 15 }}>
                        Henüz favori eklenmedi
                    </Text>
                )}
            </Card.Content>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>{selectedFavorite} Kuru</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            {selectedFavorite}: {favoriteRate}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={handleShare}>Paylaş</PaperButton>
                        <PaperButton onPress={() => setDialogVisible(false)}>Kapat</PaperButton>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </Card>
    );
};

const styles = StyleSheet.create({
    // ... (stiller - önceki örnekteki gibi)
});

export default FavoritesList;