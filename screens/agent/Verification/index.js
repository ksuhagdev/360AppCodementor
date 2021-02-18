import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import GradientButton from '../../../components/Button';

export default function verification({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={{ fontSize: 15, lineHeight: 22, fontFamily: 'font-light' }}>
          Our team will reach out to yourself to verify your real estate credentials over next 1-3 days.
        </Text>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <GradientButton>DONE</GradientButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

verification.navigationOptions = {
  title: 'Extra Verificaton Required',
};
