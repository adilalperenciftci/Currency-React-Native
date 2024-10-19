import React from 'react';
import { View, Text } from 'react-native';

const CurrencyDetailsScreen = ({ route }) => {
    const { currency } = route.params;
    return (
        <View>
            <Text>{currency} hakkında detaylı bilgi burada gösterilecek.</Text>
        </View>
    );
};

export default CurrencyDetailsScreen;