import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet } from 'react-native';
import { Text, Button as PaperButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

const CurrencyConverter = ({ exchangeRates, currencyOptions }) => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
    if (!rates || !fromCurrency || !toCurrency || !amount || isNaN(amount)) {
      return null;
    }

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    if (!fromRate || !toRate) {
      return null;
    }
    const convertedAmount = (amount * toRate) / fromRate;
    return convertedAmount.toFixed(2);
  };

  const handleConversion = () => {
    if (!amount || !fromCurrency || !toCurrency) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurunuz.");
      return;
    }

    const converted = convertCurrency(
      parseFloat(amount),
      fromCurrency,
      toCurrency,
      exchangeRates?.conversion_rates
    );

    if (!converted) {
      Alert.alert("Hata", "Dönüştürme işlemi başarısız.");
      return;
    }
    setConvertedAmount(converted);
  };

  return (
    <View style={styles.converterContainer}>
      <TextInput
        label="Miktar"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <RNPickerSelect
        items={currencyOptions}
        value={fromCurrency}
        onValueChange={setFromCurrency}
        style={pickerSelectStyles}
        placeholder={{ label: "Çevirilecek para birimi", value: null }}
      />

      <RNPickerSelect
        items={currencyOptions}
        value={toCurrency}
        onValueChange={setToCurrency}
        style={pickerSelectStyles}
        placeholder={{ label: "Hedef para birimi", value: null }}
      />

      <PaperButton onPress={handleConversion} mode="contained">
        Çevir
      </PaperButton>

      {convertedAmount && (
        <Text style={styles.resultText}>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  converterContainer: {
    padding: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resultText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
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

export default CurrencyConverter;