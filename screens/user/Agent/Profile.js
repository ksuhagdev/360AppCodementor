import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import ImageTile from '../../../components/helper/Tile';
import { colors } from '../../../theme/constants';

export default function AgentProfileOfUser({}) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.info}>
        <Image
          style={styles.img}
          source={{
            uri: 'https://i.pravatar.cc/110',
          }}
        />
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'column',
            flexWrap: 'wrap',
            marginLeft: 12,
          }}>
          <Text style={styles.text}>Julian Millan</Text>
          <Text style={[styles.text, { fontSize: 13, marginTop: 4 }]}>Senior Partner</Text>
          <Text style={{ fontSize: 12, marginTop: 6, fontFamily: 'font-bold' }}>846 Followers</Text>
          <TouchableOpacity>
            <View style={styles.followBtn}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'font-regular',
                  color: '#fff',
                }}>
                Follow Julian
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 0.5,
              borderBottomColor: 'rgba(0,0,0,0.1)',
              paddingBottom: 20,
            }}>
            <View>
              <Text style={styles.text}>RT Edgar – Toorak</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'font-light',
                  color: 'rgba(0, 0, 0, 0.7)',
                  marginTop: 7,
                }}>
                10 Wallace Avenue
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'font-light',
                  color: 'rgba(0, 0, 0, 0.7)',
                }}>
                Toorak Vic 314
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                  <Image source={require('../../../assets/image/message.png')} style={styles.infoBtn} />
                  <Text style={{ marginTop: 4, fontFamily: 'font-light' }}>Message</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                  <Image source={require('../../../assets/image/call.png')} style={styles.infoBtn} />
                  <Text style={{ marginTop: 4, fontFamily: 'font-light' }}>Call</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingVertical: 13.5 }}>
            <Text
              style={{
                fontSize: 11,
                lineHeight: 18,
                fontFamily: 'font-regular',
              }}>
              Julian is widely as one of Australia’s leading estate agents and specialises in sell- ing prestige homes and luxury developments. Her intellect,
              market knowledge and dedication combined with the support of her team, ensure her clients are provided with a world-class real estate experience.
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <FlatList numColumns={3} data={data} renderItem={({ item }) => <ImageTile item={item} />} keyExtractor={item => item.id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

AgentProfileOfUser.navigationOptions = {
  title: 'Agent Profile',
  headerMode: 'screen',
};

const data = [
  {
    id: '1',
    title: '20 Lance Court',
    img: require('../../../assets/image/agent/agent-1.png'),
  },
  {
    id: '2',
    title: '12 Mercer Rd',
    img: require('../../../assets/image/agent/agent-2.png'),
  },
  {
    id: '3',
    title: '80 Orrong Rd',
    img: require('../../../assets/image/agent/agent-3.png'),
  },
  {
    id: '4',
    title: '140 Kooyong',
    img: require('../../../assets/image/agent/agent-4.png'),
  },
  {
    id: '5',
    title: '78 Hamerback',
    img: require('../../../assets/image/agent/agent-5.png'),
  },
];

const styles = StyleSheet.create({
  followBtn: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  img: {
    borderRadius: 100,
    height: 115,
    marginRight: 13,
    width: 115,
  },
  info: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    flexDirection: 'row',
    padding: 20,
  },
  infoBtn: {
    height: 44,
    marginHorizontal: 20,
    width: 44,
  },
  text: {
    fontFamily: 'font-regular',
    fontSize: 16,
  },
});
