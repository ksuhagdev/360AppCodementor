import React from 'react';
import { View, Image, Text, SafeAreaView, ScrollView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Data from '../../agent/AgentProfile/data';
import ColorFade from '../../../components/helper/ColorFade';
import ImageTile from '../../../components/helper/Tile';

function AgentBubbles({ navigation }) {
  return (
    <View style={styles.bubblesContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('AgentProfileOfUser')}>
        <View style={styles.bubble}>
          <Image
            style={styles.img}
            source={{
              uri: 'https://i.pravatar.cc/70',
            }}
          />
          <Text
            style={{
              color: '#ffffff',
              marginTop: 5,
              fontFamily: 'font-light',
              fontSize: 12,
            }}>
            Julian
          </Text>
          <View style={styles.add}>
            <Icon name="add" size={10} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AgentProfileOfUser')}>
        <View style={styles.bubble}>
          <Image
            style={styles.img}
            source={{
              uri: 'https://i.pravatar.cc/80',
            }}
          />
          <Text
            style={{
              color: '#ffffff',
              marginTop: 5,
              fontFamily: 'font-light',
              fontSize: 12,
            }}>
            Thomas
          </Text>
          <View style={styles.add}>
            <Icon name="add" size={10} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function PropertyAddressOfUser({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <TouchableOpacity activeOpacity={0.88} onPress={() => navigation.navigate('PropertyRoomVideo')}>
            <View style={{ position: 'relative', alignItems: 'center' }}>
              <Image style={styles.hero} source={require('../../../assets/image/agent-main-noopacity.png')} />

              <AgentBubbles navigation={navigation} />
              <ColorFade colors={['transparent', 'rgba(0,0,0,0.5)']} height="100%" zIndex={1} />
            </View>
          </TouchableOpacity>

          <View style={styles.info}>
            <View style={styles.count}>
              <View style={{ alignItems: 'center', paddingHorizontal: 23 }}>
                <Text style={{ fontSize: 20, fontFamily: 'font-regular' }}>120</Text>
                <Text style={{ fontSize: 12, fontFamily: 'font-regular' }}>Views</Text>
              </View>
              <View style={{ alignItems: 'center', paddingHorizontal: 23 }}>
                <Text style={{ fontSize: 20, fontFamily: 'font-regular' }}>1.2K</Text>
                <Text style={{ fontSize: 12, fontFamily: 'font-regular' }}>Likes</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 14,
              }}>
              <View style={styles.btnBox}>
                <Text style={styles.boxText}>Floor Plan</Text>
              </View>
              <View
                style={[
                  styles.btnBox,
                  {
                    marginHorizontal: 8,
                  },
                ]}>
                <Text style={styles.boxText}>Street View</Text>
              </View>
              <View style={styles.btnBox}>
                <Text style={styles.boxText}>Get Directions</Text>
              </View>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontFamily: 'font-light' }}>140 Kooyong Rd, Armdale</Text>
              <Text style={{ fontFamily: 'font-light' }}>4 Bedrooms, 2 Bathrooms 1 Garage</Text>
              <Text style={{ fontFamily: 'font-light' }}>Open Sat 19 Oct | Available Now</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <FlatList numColumns={3} data={Data} renderItem={({ item }) => <ImageTile item={item} />} keyExtractor={item => item.id} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

PropertyAddressOfUser.navigationOptions = {
  title: '140 Kooyong Rd Armadale',
};

const styles = StyleSheet.create({
  actionBtns: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  add: {
    alignItems: 'center',
    backgroundColor: '#d81b60',
    borderRadius: 50,
    bottom: 15,
    height: 20,
    justifyContent: 'center',
    left: 15,
    position: 'absolute',
    width: 20,
  },
  boxText: {
    color: '#000',
    fontFamily: 'font-regular',
    fontSize: 13,
  },
  btnBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  bubble: {
    alignItems: 'center',
    elevation: 4,
    marginHorizontal: 8,
    position: 'relative',
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15.19,
  },
  bubblesContainer: {
    alignItems: 'center',
    bottom: 15,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 2,
  },
  count: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 39,
    justifyContent: 'space-between',
    width: 230,
  },
  hero: {
    height: 250,
    width: '100%',
  },
  img: {
    borderColor: '#fff',
    borderRadius: 50,
    borderWidth: 1,
    height: 50,
    width: 50,
  },
  info: {
    alignItems: 'center',
    padding: 18,
  },
});
