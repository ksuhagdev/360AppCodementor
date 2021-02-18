import React from 'react';
import { SafeAreaView, View, ImageBackground, ScrollView, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import popImg from '../../../assets/image/soundtrack/pop-2x.png';
import rockImg from '../../../assets/image/soundtrack/rock-2x.png';
import electronicImg from '../../../assets/image/soundtrack/instrumental-2x.png';
import indieImg from '../../../assets/image/soundtrack/indie-2x.png';
import soundtrackThumb from '../../../assets/image/soundtrack/soundtrack-thumb.png';

export default function DiscoverSoundtrack({ navigation }) {
  const handlePress = (to, genre) => {
    navigation.navigate(to, {
      genre: genre.toLowerCase(),
      videoUri: navigation.getParam('videoUri', null),
      videoType: navigation.getParam('videoType', null),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <ImageBackground style={styles.hero} source={soundtrackThumb} />

          <View style={styles.list}>
            <Text style={styles.discover}>DISCOVER A SOUND</Text>

            <View style={styles.art}>
              {albumList.map((item, index) => {
                return (
                  <TouchableOpacity onPress={() => handlePress('TrackList', item.genre)} key={index}>
                    <View style={styles.artContainer}>
                      <Image source={item.art} style={styles.artImg} />

                      <Text style={styles.genre}>{item.genre}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const albumList = [
  { genre: 'Pop', art: popImg },
  { genre: 'Electronic', art: electronicImg },
  { genre: 'Indie', art: indieImg },
  { genre: 'Rock', art: rockImg },
];

DiscoverSoundtrack.navigationOptions = {
  title: 'Choose Your Soundtrack',
};

const styles = StyleSheet.create({
  art: {
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
  artContainer: {
    margin: 25,
    alignItems: 'center',
  },
  artImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  container: {
    flex: 1,
  },
  discover: {
    fontSize: 11,
    fontFamily: 'font-bold',
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  genre: {
    fontFamily: 'font-regular',
    fontSize: 15,
    marginTop: 13,
  },
  hero: {
    height: 250,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
});
