import React, { useEffect, useState } from 'react';
import { View, FlatList, ImageBackground, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import * as account from '../../../actions/property';
import Tabs from '../../../components/Tabs/Tabs'

const Genre = () => {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('Trending')
    const { musicGenre } = useSelector(store => store.property)
    console.log("Music GENRE POP", musicGenre)
    useEffect(() => {
        (async () => {
            await dispatch(account.getMusicGenre('POP'))
        })();
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ width: '100%', height: '50%' }}>
                <ImageBackground style={{ width: '100%', height: '100%' }}  source={{ uri: 'https://media.timeout.com/images/101659805/image.jpg' }}><Text>Hip Hop</Text></ImageBackground>
            </View>
            <View style={styles.tabsContainer}>
                <Tabs style={{ width: '45%' }} isActive={activeTab === 'Trending'} onPress={() => setActiveTab('Trending')}>
                    Trending
          </Tabs>



                <Tabs style={{ width: '45%' }} isActive={activeTab === 'MostUsed'} onPress={() => setActiveTab('MostUsed')}>
                    Most Used
          </Tabs>
            </View>

            {activeTab === 'Trending' && <FlatList
                data={musicGenre}

                renderItem={({ item }) => (
                    <TouchableOpacity style={{ flexDirection: 'row', width: '50%', paddingVertical: 10, marginLeft: 20, alignItems: 'center' }}>
                        <Image style={{ width: 60, height: 60, marginRight: 20 }} source={{ uri: item.poster_url }} />
                        <View >
                            <Text style={{ fontWeight: 'bold' }}>{item.title}  </Text>
                            <Text style={{ color: '#424949' }}>{item.artist}</Text>
                            <Text style={{ color: '#424949' }}>0.30</Text>

                        </View>


                    </TouchableOpacity>
                )}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }, tabsContainer: {
        marginTop: 20,
        width: '100%',
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

export default Genre;