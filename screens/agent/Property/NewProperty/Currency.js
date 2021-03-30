import React from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';

import GradientButton from '../../../../components/Button/Button2';
import {Searchbar} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import * as cc from 'currency-codes';
import {useDispatch, useSelector} from 'react-redux'
import * as action from '../../../../actions/message'
const Currency = ({navigation}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
const dispatch = useDispatch();
  const setCurrecy = async (type) => {
    await AsyncStorage.setItem('currency',type)
    await dispatch(action.SetCurrency(type))
    console.log("Done")
    navigation.pop()
  }
  // const [currecy, setCurrency] = useState(cc.codes())
  const onChangeSearch = (query) => {
    if(query.length> 0){
      setCurrecy()
    }
  };
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>
      <FlatList
        data={cc.codes()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={({item}) => (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal:10,
              marginLeft: 20,
              width: '100%',
              flexDirection: 'row',
              
              justifyContent: 'space-between',
              paddingRight:40
            }}>
            <View>
              <Text style={{fontWeight: 'bold'}}>{item} </Text>
              <View style={{width:  '100%'}}>
                <Text style={{color: '#424949'}}>{cc.code(item).currency}</Text>
              </View>
            </View>
            <GradientButton onPress={() => setCurrecy(item)}>Select</GradientButton>
          </View>
        )}
      />
    </View>
  );
};

export default Currency;
