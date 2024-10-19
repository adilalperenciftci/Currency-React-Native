import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { 
  Text, ActivityIndicator, Title, Button as PaperButton, 
  Snackbar, Searchbar, Divider 
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExchangeRates } from '../api/exchangeRate';
import CurrencyList from '../components/CurrencyList';
import CurrencyConverter from '../components/CurrencyConverter';
import FavoritesSection from '../components/FavoritesSection';
import HistoricalRates from '../components/HistoricalRates'; // HistoricalRates bileşenini ekle

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('TRY');
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errorSnackbarVisible, setErrorSnackbarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    const fetchAvailableCurrencies = async () => {
      try {
        const data = await getExchangeRates('USD');
        const currencies = Object.keys(data.conversion_rates);
        setCurrencyOptions(currencies.map(currency => ({ label: currency, value: currency })));
      } catch (error) {
        console.error("Para birimleri getirilirken hata:", error);
        setErrorSnackbarVisible(true);
      } finally {
        fetchRates();
      }
    };

    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Favori para birimleri yüklenirken hata:", error);
      }
    };

    loadFavorites();
    fetchAvailableCurrencies();
  }, []);

  const fetchRates = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getExchangeRates(selectedCurrency);
      setExchangeRates(data);
      setErrorSnackbarVisible(false);
    } catch (error) {
      console.error("Kurlar getirilirken hata:", error);
      setErrorSnackbarVisible(true);
    } finally {
      setRefreshing(false);
    }
  }, [selectedCurrency]);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error("Favori para birimleri kaydedilirken hata:", error);
      }
    };
    saveFavorites();
  }, [favorites]);

  const toggleFavorite = useCallback((currency) => {
    const isFavorite = favorites.includes(currency);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav !== currency));
    } else if (favorites.length < 5) {
      setFavorites([...favorites, currency]);
    } else {
      Alert.alert("Favori Limiti", "En fazla 5 favori para birimi ekleyebilirsiniz.");
    }
  }, [favorites]);

  const removeFavorite = (currency) => {
    setFavorites(favorites.filter((fav) => fav !== currency));
  };

  const onChangeSearch = useCallback((query) => setSearchQuery(query), []);

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Güncel Döviz Kurları</Title>

      <Searchbar
        placeholder="Para birimi ara..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <RNPickerSelect
        onValueChange={(value) => setSelectedCurrency(value)}
        items={currencyOptions}
        value={selectedCurrency}
        style={pickerSelectStyles}
        placeholder={{
          label: "Para birimi seçin...",
          value: null,
        }}
      />

      <PaperButton
        mode="contained"
        onPress={fetchRates}
        style={styles.refreshButton}
        icon="refresh"
        loading={refreshing}
        disabled={refreshing}
      >
        Kurları Güncelle
      </PaperButton>

      {exchangeRates ? (
        <CurrencyList
          data={exchangeRates.conversion_rates}
          selectedCurrency={selectedCurrency}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          searchQuery={searchQuery}
          refreshing={refreshing}
          onRefresh={fetchRates}
        />
      ) : (
        <ActivityIndicator animating={true} size="large" style={styles.loadingIndicator} />
      )}

      <Divider style={styles.divider} />

      <CurrencyConverter
        exchangeRates={exchangeRates}
        currencyOptions={currencyOptions}
      />

      <Divider style={styles.divider} />

      <FavoritesSection
        favorites={favorites}
        removeFavorite={removeFavorite}
      />

      <Divider style={styles.divider} />

      {/* Historical Rates Bileşeni Eklendi */}
      <HistoricalRates selectedCurrency={selectedCurrency} />

      <Snackbar
        visible={errorSnackbarVisible}
        onDismiss={() => setErrorSnackbarVisible(false)}
        action={{
          label: 'Kapat',
          onPress: () => setErrorSnackbarVisible(false),
        }}
      >
        API çağrısı başarısız oldu. Lütfen daha sonra tekrar deneyin.
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  searchBar: {
    marginBottom: 10,
  },
  refreshButton: {
    marginVertical: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  divider: {
    marginVertical: 10,
    borderWidth: 1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    color: 'black',
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    color: 'black',
    marginBottom: 16,
  },
});

export default HomeScreen;
