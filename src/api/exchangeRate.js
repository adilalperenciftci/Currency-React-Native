import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'b82bed9a1c71ffbb7852124f'; // Yeni API anahtarı
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;
const CACHE_TIMEOUT = 3600000; 

export const getExchangeRates = async (baseCurrency = 'TRY', targetCurrencies = []) => {
  try {
    const cacheKey = `exchangeRates_${baseCurrency}_${targetCurrencies.join(',')}`;
    const cachedData = await AsyncStorage.getItem(cacheKey);

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_TIMEOUT) {
        return data;
      }
    }

    // URL'yi oluşturun
    let url = `${BASE_URL}/latest/${baseCurrency}`;
    if (targetCurrencies.length > 0) {
      url += `?symbols=${targetCurrencies.join(',')}`;
    }

    console.log('API çağrısı yapılıyor:', url); // Debug log

    const response = await axios.get(url);

    if (response.data.result === 'success') {
      const dataToCache = {
        data: response.data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(dataToCache));
      return response.data;
    } else {
      throw new Error(response.data['error-type'] || 'API hatası');
    }
  } catch (error) {
    console.error('API çağrısı başarısız:', error);

    const cacheKey = `exchangeRates_${baseCurrency}_${targetCurrencies.join(',')}`;

    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      console.warn('Önbelleğe alınmış veriler kullanılıyor (offline).');
      return data;
    }

    throw error;
  }
};

export const getAvailableCurrencies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/codes`);

    if (response.data.result === "success") {
      return response.data.supported_codes.map(([code, name]) => ({
        label: `${code} - ${name}`,
        value: code,
      }));
    } else {
      throw new Error(response.data['error-type'] || 'API hatası');
    }
  } catch (error) {
    console.error('Desteklenen para birimleri alınamadı', error);
    throw error;
  }
};

// Geçmiş kurları almak için fonksiyon
export const getHistoricalRates = async (currency, date) => {
  try {
    const url = `${BASE_URL}/historical/${date}?base=${currency}`;
    const response = await axios.get(url);

    if (response.data.result === 'success') {
      return response.data.rates; // API'den dönen verilere göre ayarlayın
    } else {
      throw new Error(response.data['error-type'] || 'API hatası');
    }
  } catch (error) {
    console.error("Geçmiş kurlar alınırken hata:", error);
    throw error;
  }
};
