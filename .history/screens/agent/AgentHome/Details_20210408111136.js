import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, View,VirtualizedList, FlatList, StatusBar, StyleSheet, Dimensions } from 'react-native';

import AlertMessage from '../../../components/AlertMessage';
import styled from 'styled-components/native'
import Hero from './Hero'
const Container = styled.View`
	flex: 1;
  background: transparent;
  backgroundColor: #000
`

export default function Details({ navigation, onGetMoreProperties }) {
  const [state, setState] = useState({
    scrollIndex: 0,
  });

  const [videoShouldPlay, setVideoShouldPlay] = useState(true);
  const { allPropertiesLoading, allProperties } = useSelector(store => store.property);
  const [filterProperty, setFilterProperty] = useState([])
 // console.log("All Properties", allProperties)
  // allProperties.push('https://d3qk4bte9py5ck.cloudfront.net/c1ba72eb-121f-4a37-bedf-07df7bf48d92/hls/11.m3u8')
  const viewabilityConfig = { itemVisiblePercentThreshold: 90, minimumViewTime: 300 };
  const [test, setTest] = useState(null)
  // const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })
  const getMoreProperties = () => {
    console.log("Getting more videos")
    onGetMoreProperties && onGetMoreProperties();
  };
  const [pause, setPause] = useState(true)

  const goToSearch = () => {
    navigation.navigate('Search');
  };
  // console.log("Navigation", filterProperty)
  const onViewRef = event => {
    let index = 0;
    const scrollHeight = event.nativeEvent.layoutMeasurement.height;
    const currentScrollPos = event.nativeEvent.contentOffset.y;

    if (Number.isInteger(event.nativeEvent.contentOffset.y)) {
      if (currentScrollPos >= scrollHeight) {
        index = currentScrollPos / scrollHeight;
      }

      setState({
        ...state,
        scrollIndex: parseInt(index, 10),
      });
    }
  };

  
  useEffect(() => {
     const filteredVideo = allProperties.filter(property => property.is_live)
     const filterunique = [...new Set(filteredVideo.map(item => item.id))]
    //  console.log("Filter Unique Video", filterunique)
     setFilterProperty(filteredVideo)
  },[allProperties])

  useEffect(() => {
    // dispatch(clearNewProperty())
    const unsubscribeFocus = navigation.addListener('didFocus', () => {
      setVideoShouldPlay(true);
    });

    const unsubscribeBlur = navigation.addListener('didBlur', () => {
      setVideoShouldPlay(false);
    });

    return () => {
      unsubscribeFocus.remove();
      unsubscribeBlur.remove();
    };


  }, []);

  if (allPropertiesLoading && (!filterProperty || filterProperty.length === 0)) {
    return (
      <View style={[styles.container, styles.primaryBg]}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 1)" barStyle="light-content" />

        <SafeAreaView style={styles.fullWidth}>
          <View style={[styles.fullWidth, styles.content]}>
            <AlertMessage size={48} color="#fff" name="home-group" bgColor="#d81b60" textColor="#fff" message="Getting properties near your area..." />

            {/* <NavActions navigation={navigation} /> */}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!allPropertiesLoading && (!filterProperty || filterProperty.length === 0)) {
    return (
      <View style={[styles.container, styles.primaryBg]}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 1)" barStyle="light-content" />

        <SafeAreaView style={styles.fullWidth}>
          <View style={[styles.fullWidth, styles.content]}>
            <AlertMessage
              size={48}
              color={'#fff'}
              name="home-city"
              bgColor="#d81b60"
              textColor="#fff"
              message="No properties found near your location. Search for properties to narrow down what you're looking for."
              showCtaButton={true}
              onButtonClicked={goToSearch}
            />

            {/* <NavActions navigation={navigation} /> */}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  //   const onViewableItemsChanged =useRef((viewableItems)=> {
  //     console.log("ViewableItem", viewableItems)

  // })

  // const onViewableItemsChanged = useCallback(( {viewableItems} ) => {
  //   setTest(() => {
  //     // We can have access to the current state without adding it
  //     //  to the useCallback dependencies
  //     console.log("NOSOSO",viewableItems)
  //     return viewableItems
  //   })
  // })
  // console.log("TEST VALUE", test)

  return (
    <>
    <StatusBar
				translucent
				backgroundColor='transparent'
				barStyle='light-content'
			/>
      <Container>
        <Hero videos={filterProperty} navigation={navigation} getMoreProperties={getMoreProperties}/>
      </Container>
    </>

  )
  
  // return (
  //   <View>
  //     <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="light-content" />
  //     <Flatlist
  //       horizontal={false}
  //       showsVerticalScrollIndicator={false}
  //       snapToAlignment="top"
  //       viewabilityConfig={viewabilityConfig}
  //       pagingEnabled={true}
  //       decelerationRate="fast"
  //       data={filterProperty}
  //       // onViewableItemsChanged={onViewableItemsChanged.current}
  //       keyExtractor={item => `prop_${item.id}`}
  //       initialNumToRender={3}
  //       onEndReachedThreshold={0.3}
  //       maxToRenderPerBatch={3}
  //       onEndReached={getMoreProperties}
  //       windowSize={1}
  //       snapToInterval={Dimensions.get('window').height}
  //       onScroll={onViewRef}
  //       scrollEventThrottle={15}
  //       getItemLayout={(_data, index) => ({
  //         length: Dimensions.get('screen').height-70,
  //         offset: Dimensions.get('screen').height * index,
  //         index,
  //       })}
  //       renderItem={({ item, index }) => (
  //         // (item.is_live &&
  //         <PropertyDetail currentIndex={state.scrollIndex} index={index} property={item} shouldPlay={videoShouldPlay} navigation={navigation} />
  //         // )
  //       )}
  //       style={styles.fullWidth}
  //     />

  //     {/* <NavActions navigation={navigation} /> */}
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  content: {
    backgroundColor: '#000',
    height: '100%',
    paddingVertical: 10,
  },
  fullHeight: {
    height: Dimensions.get('window').height,
  },
  fullWidth: {
    width: '100%',
    height: Platform.OS === 'android' ? Dimensions.get('window').height + StatusBar.currentHeight : Dimensions.get('window').height,
    
  },
  primaryBg: {
    backgroundColor: '#000',
  },
});
