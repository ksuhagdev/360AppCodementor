// import {Video} from 'expo-av';
import React, {Component, useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  ScrollView, Image
} from 'react-native';
import Tabs from '../../../components/Tabs/Tabs'
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux'
import SearchBar from '../../../components/ContactAcess/SearchBar';
import request from '../../../helper/functions/request';
import {getMusicTrending} from '../../../actions/property'
const data = [
  {key: 'Pop ',key2:'(231 tracks)'},
  {key: 'Hio Hop', key2:'(72 tracks)'},
  {key: 'Rock', key2:'(175 tracks)'},
  {key: 'Cult Classics ', key2:'(81 tracks)'},
  {key: 'Lounge ',key2:'(22 tracks)'},
  {key: 'Cinematic',key2:'(103 tracks)'},
  {key: 'R & B ',key2:'(43 tracks)'},
  {key: 'Instrumental',key2:'(22 tracks)'},

];
const data2 = [
  {key: 'GoodThing (with Kehlani) ',key2:'Zedd'},
  {key: 'Holy Water', key2:'(Galantis)'},
  {key: 'Legends', key2:'(Now United)'},
  {key: 'Legends', key2:'(Now United)'},
  {key: 'Legends', key2:'(Now United)'},
  {key: 'Legends', key2:'(Now United)'},
  {key: 'Legends', key2:'(Now United)'},
  {key: 'Legends', key2:'(Now United)'},
  

];

const {width, height} = Dimensions.get('window');
const Music =  (props) => {
const dispatch = useDispatch();
  // async componentDidMount() {
  //   try{
  //     const data = await request({url: '/music/trending?start=0&end=5', config:{method: 'GET'}})
  //     console.log('DATA for trending Music', data)
  //   }catch(e){console.log("Error from MUSIC",e)}

  // }  

  const [activeTab, setActiveTab] = useState('Trending');
  const placeholder = 'search';
  const [search, setSearch] = useState('')
  const {musicTrending} = useSelector(store => store.property)
 console.log("Music Trending Class", musicTrending)
  useEffect(() => {
    (async () => {
      await dispatch(getMusicTrending())
      
    })();
  },[])

    return (
      <View style={styles.container}>
        <SearchBar
          searchPlaceholder={placeholder}
          // onChangeText={this.search}
        />
         <View style={{ width:'100%'}}>
          <FlatList
            data={data}
            numColumns={2}
          
            renderItem={({item}) => (
              <View style={{flexDirection:'row', width:'50%', paddingVertical:10, }}>
                <TouchableOpacity
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: '#ff1493',
                    borderRadius:5, marginLeft:10, marginRight:10
                  }}></TouchableOpacity>
                <Text style={{fontWeight:'bold'}}>{item.key}</Text>
                <Text style={{ color: '#424949'}}>{item.key2}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.tabsContainer}>
          <Tabs style={{width:'45%'}} isActive={activeTab === 'Trending'} onPress={() => setActiveTab('Trending')}>
            Trending
          </Tabs>
         


          <Tabs style={{width:'45%'}} isActive={activeTab === 'MostUsed'} onPress={() => setActiveTab('MostUsed')}>
            Most Used
          </Tabs>
        </View>
        
          {activeTab === 'Trending' && <FlatList
            data={musicTrending}
          
            renderItem={({item}) => (
              <TouchableOpacity style={{flexDirection:'row', width:'50%', paddingVertical:10, marginLeft: 20, alignItems: 'center'}}>
                <Image style={{width: 60, height: 60, marginRight: 20 }} source={{uri: item.poster_url}}/>
                  <View >
                  <Text style={{fontWeight:'bold'}}>{item.title}  </Text>
                  <Text style={{ color: '#424949'}}>{item.artist}</Text>
                  <Text style={{ color: '#424949'}}>0.30</Text>

                  </View>
                
               
              </TouchableOpacity>
            )}
          />}
        
       

      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },tabsContainer: {
    marginTop: 20,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gridView: {
    //  flex: 2,
    marginTop: 10,
    flexDirection: 'row',
  },
  button: {
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
    marginRight: 5,
    backgroundColor: '#00BCD4',
    justifyContent: 'space-between',
    //borderRadius:10,
    // borderWidth: 1,
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  textStyle: {
    fontSize: 20,
    marginTop: 5,
    justifyContent: 'space-between',
  },
  tabsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Music
