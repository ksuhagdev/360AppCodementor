import React from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';

import GradientButton from '../../../../components/Button';
import { Searchbar } from 'react-native-paper';

const data = [
  {key: 'AUD ', key2: 'Australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
  {key: 'AUD ', key2: 'australia'},
];
const Currency = () => {
    
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);
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
        data={data}
        ItemSeparatorComponent={ItemSeparatorView}

        renderItem={({item}) => (
          <View
            style={{
              paddingVertical: 10,
              marginLeft: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontWeight: 'bold'}}>{item.key} </Text>
              <Text style={{color: '#424949'}}>{item.key2}</Text>
            </View>

            <GradientButton style={{paddingHorizontal: 15}}>
              CONTINUE
            </GradientButton>
          </View>
        )}
      />
     
    </View>
  );
};

export default Currency;
