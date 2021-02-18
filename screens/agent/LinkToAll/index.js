import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import GradientButton from '../../../components/Button';

export default function LinkToAll({ navigation }) {
  const handleOnPress = navigateTo => {
    navigation.navigate(navigateTo);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ padding: 20, flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 22,
              fontFamily: 'font-bold',
              marginBottom: 12,
            }}>
            Figma Row 1 Screens
          </Text>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('UserProfile')}>User details (Row 1 - Screen 3)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('AgentProfile')}>Agent details (Row 1 - Screen 4)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('CameraSession')}>Camera recording (Row 1 - Screen 6, 7)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('AddTitle')}>Add Title (Row 1 - Screen 8)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('DiscoverSoundtrack')}>Discover Soundtrack (Row 1 - Screen 9)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('TrackList')}>Soundtrack List (Row 1 - Screen 10)</GradientButton>
          </View>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 22,
              fontFamily: 'font-bold',
              marginVertical: 12,
            }}>
            Figma Row 2 Screens
          </Text>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('NewProperty')}>Setup property (Row 2 - Screen 1)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('PropertyDetails')}>Setup property - details (Row 2 - Screen 2)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('ChooseCampaign')}>Choose Campaign (Row 2 - Screen 3)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('RentalSetup')}>Rental Setup (Row 2 - Screen 4)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('PrivateSale')}>Private Sale (Row 2 - Screen 5)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('Auction')}>Auction (Row 2 - Screen 6)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('EditDateAndTime')}>{'Edit Date & Time'} (Row 2 - Screen 8)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('EditInspectionTime')}>Edit Inspection Times (Row 2 - Screen 9)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('Hashtags')}>Rental Setup - Hashtags (Row 2 - Screen 10)</GradientButton>
          </View>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 22,
              fontFamily: 'font-bold',
              marginVertical: 12,
            }}>
            Figma Row 3 Screens
          </Text>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('InviteOthers')}>Choose Campaign - Invite Others (Row 3 - Screen 1)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('OpenContacts')}>Contact Picker (Row 3 - Screen 2)</GradientButton>
          </View>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 22,
              fontFamily: 'font-bold',
              marginVertical: 12,
            }}>
            Figma Row 4 Screens
          </Text>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('SignupOne')}>Sign Up as Agent 1 (Row 4 - Screen 1)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('SignupTwo')}>Sign Up as Agent 2 (Row 4 - Screen 2)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('SignupThree')}>Sign Up as Agent 3 (Row 4 - Screen 3)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('Verification')}>Extra Verificaton (Row 4 - Screen 5)</GradientButton>
          </View>
          <View style={{ marginVertical: 2 }}>
            <GradientButton onPress={() => handleOnPress('PrivateEmail')}>Private Email (Row 4 - Screen 6)</GradientButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

LinkToAll.navigationOptions = {
  title: 'Test Available Screens',
};
