import React from 'react';
import { FlatList, Text, View, ImageBackground, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import ColorFade from '../../../components/helper/ColorFade';

const placeholderImage = require('../../../assets/image/property-placeholder2.jpg');

const width = Dimensions.get('window').width;
const imgDimension = width / 3 - 2;

export default function PropertiesPanel({hasAccess, data, type, isLoading, navigation }) {
  // console.log("Data for ",type, data)
  const onTrendingPressed = (index, item) => {
    console.log("Going Into Hero", index, item)
    navigation.navigate('VideoPlayScreen', { data: data, CurrentIndex: index, item: item });
  };

  return isLoading && data.length === 0 ? (
    <ActivityIndicator size="small" color="#d81b60" />
  ) : (
    <View style={styles.alignItemsCenter}>
      {data.length > 0 && (
        <FlatList
          numColumns={3}
          data={data}
          renderItem={({ item, index }) => (
             <TouchableOpacity onPress={() => navigation.navigate('PropertyAddress', { propertyId: item.id, title: item.title })}>
             {/* <TouchableOpacity onPress={() =>onTrendingPressed(index, item)}> */}
              <ImageBackground style={styles.imgItem} source={item.main_image_url ? { uri: item.main_image_url } : placeholderImage}>
                <ColorFade height={118} colors={['transparent', 'rgba(0, 0, 0, 0.3)']} />

                <Text style={styles.textOverlay}>{item.street}</Text>
              </ImageBackground>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      )}

      {data.length === 0 && <Text style={styles.warning}>No {type} properties</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  alignItemsCenter: {
    flex: 1,
  },
  imgItem: {
    justifyContent: 'flex-end',
    margin: 1,
    width: imgDimension,
    height: imgDimension,
  },
  textOverlay: {
    fontFamily: 'font-bold',
    fontSize: 12,
    zIndex: 2,
    padding: 6,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  warning: {
    alignSelf: 'center',
  },
});
