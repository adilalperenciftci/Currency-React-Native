import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Title, IconButton } from 'react-native-paper';

const FavoritesSection = ({ favorites, removeFavorite }) => {
  return (
    <View style={styles.favoritesContainer}>
      <Title style={styles.favoritesTitle}>Favori Para Birimleri</Title>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Text style={styles.favoriteCurrency}>{item}</Text>
              <IconButton
                icon="close-circle-outline"
                size={20}
                color="red"
                onPress={() => removeFavorite(item)}
                style={styles.removeButton}
              />
            </View>
          )}
          contentContainerStyle={styles.favoritesList}
        />
      ) : (
        <Text style={styles.noFavoritesText}>
          Henüz favori para birimi eklenmemiş.
        </Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  favoritesContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  favoritesList: {
    flexGrow: 0,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  favoriteCurrency: {
    fontSize: 16,
    color: '#007BFF',
  },
  removeButton: {
    marginLeft: 10,
  },
  noFavoritesText: {
    textAlign: 'center',
    color: '#888',
  },
});

export default FavoritesSection;    