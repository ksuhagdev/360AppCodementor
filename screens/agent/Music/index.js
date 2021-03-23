// import {Video} from 'expo-av';
import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  ScrollView
} from 'react-native';
import Tab from '../../../components/Tabs'
import SearchBar from '../../../components/ContactAcess/SearchBar';
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
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchPlaceholder: 'Search',
  activeTab:'active'
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          searchPlaceholder={this.state.searchPlaceholder}
          onChangeText={this.search}
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
          <Tab isActive={this.state.activeTab === 'active'} onPress={() => this.setState({activeTab:'active'})}>
            Trending
          </Tab>
         


          <Tab isActive={this.state.activeTab === 'drafts'} onPress={() => this.setState({activeTab:'drafts'})}>
            Most Used
          </Tab>

        </View>
        <ScrollView >
          <FlatList
            data={data2}
          
            renderItem={({item}) => (
              <View style={{flexDirection:'row', width:'50%', paddingVertical:10, }}>
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor: '#ff1493',
                    borderRadius:5, marginLeft:10, marginRight:10
                  }}></TouchableOpacity>
                  <TouchableOpacity>
                  <Text style={{fontWeight:'bold'}}>{item.key}  </Text>
                  <Text style={{ color: '#424949'}}>{item.key2}</Text>

                  </TouchableOpacity>
                
               
              </View>
            )}
          />
        </ScrollView>
       

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },tabsContainer: {
    marginTop: 20,
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
