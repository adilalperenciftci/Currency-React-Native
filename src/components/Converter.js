import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { Card, Title, TextInput, Button, Text, HelperText, useTheme, ActivityIndicator } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { getAvailableCurrencies } from '../api/exchangeRate';

const Converter = ({ onConvert, amount, setAmount, fromCurrency, setFromCurrency, toCurrency, setToCurrency, convertedAmount }) => {
    const theme = useTheme();
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);
    const [amountError, setAmountError] = useState(false);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const currencies = await getAvailableCurrencies();
                setCurrencyOptions(currencies);
            } catch (error) {
                console.error("Para birimleri alınırken hata:", error);
                Alert.alert('Hata', 'Para birimleri yüklenemedi.');
            } finally {
                setLoadingCurrencies(false);
            }
        };

        fetchCurrencies();
    }, []);

    const handleAmountChange = (text) => {
        const numericText = text.replace(/[^0-9.]/g, '');
        setAmount(numericText);
        setAmountError(isNaN(parseFloat(numericText)) || parseFloat(numericText) <= 0);
    };

    const handleConvert = () => {
        if (!amount || amountError || !fromCurrency || !toCurrency) {
            Alert.alert('Hata', 'Lütfen geçerli değerler girin.');
            return;
        }

        onConvert(parseFloat(amount), fromCurrency, toCurrency);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Card style={[styles.converterContainer, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                    <Title style={[styles.converterTitle, { color: theme.colors.text }]}>Döviz Çevirici</Title>

                    <TextInput
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={handleAmountChange}
                        style={[styles.amountInput, { backgroundColor: theme.colors.background }]}
                        placeholder="Miktar"
                        mode='outlined'
                        label="Miktar"
                        error={amountError}
                    />

                    {amountError && (
                        <HelperText type="error" visible={amountError}>
                            Lütfen geçerli bir miktar girin.
                        </HelperText>
                    )}

                    {loadingCurrencies ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    ) : (
                        <>
                            <RNPickerSelect
                                items={currencyOptions}
                                value={fromCurrency}
                                onValueChange={setFromCurrency}
                                style={pickerSelectStyles}
                                placeholder={{ label: "Çevirilecek", value: null }}
                            />

                            <RNPickerSelect
                                items={currencyOptions}
                                value={toCurrency}
                                onValueChange={setToCurrency}
                                style={pickerSelectStyles}
                                placeholder={{ label: "Hedef", value: null }}
                            />
                        </>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleConvert}
                        style={styles.convertButton}
                        disabled={!amount || amountError || !fromCurrency || !toCurrency || loadingCurrencies}
                    >
                        Çevir
                    </Button>

                    {convertedAmount !== null && (
                        <Text style={[styles.resultText, { color: theme.colors.text }]}>
                            {amount} {fromCurrency} = {convertedAmount.toLocaleString()} {toCurrency}
                        </Text>
                    )}
                </Card.Content>
            </Card>
        </TouchableWithoutFeedback>
    );
};

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

const styles = StyleSheet.create({
    converterContainer: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 3,
    },
    converterTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    amountInput: {
        marginBottom: 10,
    },
    convertButton: {
        marginVertical: 10,
    },
    resultText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Converter;