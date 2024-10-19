import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { View } from 'react-native';

const { width } = Dimensions.get('window');

const CurrencyList = ({ data, selectedCurrency, favorites, toggleFavorite, searchQuery, refreshing, onRefresh }) => {
  const filteredCurrencies = useMemo(() => {
    if (!data) {
      return [];
    }

    return Object.keys(data).filter((currency) =>
      currency.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const [flagUrls, setFlagUrls] = useState({});

  useEffect(() => {
    const fetchFlagUrls = async () => {
      const urls = {};
      for (const currency of filteredCurrencies) {
        try {
          let flagCode = currency.length === 3 ? currency.slice(0, 2) : currency;
          const flagUrl = `https://flagsapi.com/${flagCode}/flat/64.png`;
          urls[currency] = flagUrl;
        } catch (error) {
          console.error(`Bayrak URL'si alınamadı (${currency}):`, error);
        }
      }
      setFlagUrls(urls);
    };

    fetchFlagUrls();
  }, [filteredCurrencies]);

  const renderExchangeRate = ({ item }) => {
    if (!data || !data[item]) {
      return null;
    }
    const rate = data[item];
    const displayedRate = selectedCurrency === 'TRY' ? (1 / rate).toFixed(2) : rate.toFixed(2);
    const isFavorite = favorites.includes(item);

    return (
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.currencyRow}>
            {flagUrls[item] && <Image source={{ uri: flagUrls[item] }} style={styles.flag} />}
            <Text style={styles.currency}> {item}: </Text>
            <Text style={styles.rate}>
              {displayedRate} {selectedCurrency === 'TRY' ? 'TRY' : `/${selectedCurrency}`}
            </Text>
          </View>
          <IconButton
            icon={isFavorite ? "star" : "star-outline"}
            iconColor={isFavorite ? "gold" : "grey"}
            size={30}
            onPress={() => toggleFavorite(item)}
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <FlatList
      data={filteredCurrencies}
      renderItem={renderExchangeRate}
      keyExtractor={(item) => item}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 16 }}
      ListEmptyComponent={<Text style={styles.noFavoritesText}>Bulunamadı</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    width: width * 0.9,
    alignSelf: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
  },
  rate: {
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
    marginLeft: 5,
  },
  noFavoritesText: {
    textAlign: 'center',
    color: '#888',
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8,
  }
});

export default CurrencyList;