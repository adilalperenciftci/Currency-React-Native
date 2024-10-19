// src/components/HistoricalRates.js

import React, { useState } from 'react';
import { View, StyleSheet, Text, Button, ScrollView } from 'react-native';
import { getHistoricalRates } from '../api/exchangeRate'; // API çağrısı için fonksiyonunuzu buraya ekleyin
import { TextInput } from 'react-native-paper'; // react-native-paper'dan TextInput
import CurrencyFlag from 'react-native-country-flag'; // Bayrakları göstermek için

const HistoricalRates = ({ selectedCurrency }) => {
  const [historicalRates, setHistoricalRates] = useState(null);
  const [date, setDate] = useState('');

  const fetchHistoricalRates = async () => {
    if (!date) return; // Tarih seçilmediyse geri dön
    try {
      const data = await getHistoricalRates(selectedCurrency, date); // API'den geçmiş döviz kurlarını çekin
      setHistoricalRates(data);
    } catch (error) {
      console.error("Geçmiş kurlar alınırken hata:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geçmiş Döviz Kurları</Text>
      
      {/* Tarih girişi için bir TextInput ekleyin */}
      <TextInput 
        label="Tarih (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <Button title="Kurları Getir" onPress={fetchHistoricalRates} />

      {/* ScrollView kullanarak içerikleri kaydırılabilir hale getiriyoruz */}
      <ScrollView style={styles.ratesContainer} contentContainerStyle={styles.contentContainer}>
        {historicalRates && (
          Object.entries(historicalRates).map(([currency, rate]) => (
            <View key={currency} style={styles.rateItem}>
              <CurrencyFlag code={currency} size={30} />
              <Text style={styles.rateText}>
                {currency}: {rate}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Flex ile tam ekran kaplama
    padding: 16,
    backgroundColor: '#f4f4f4', // Arka plan rengi
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Ortala
  },
  input: {
    marginBottom: 10,
  },
  ratesContainer: {
    flexGrow: 1, // Yeterince büyüyebilmesi için
  },
  contentContainer: {
    paddingBottom: 20, // İçeriğin alt kısmında boşluk bırak
  },
  rateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  rateText: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default HistoricalRates;
