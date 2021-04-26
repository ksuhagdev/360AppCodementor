import React, { useEffect, useState } from 'react'

import { Dimensions, View,Text , StyleSheet, AppState} from 'react-native'

import styled from 'styled-components/native'

import ViewPager from '@react-native-community/viewpager'

import PropertyDetail from '../../property/Detail';

import {Viewport} from '@skele/components'

const { height, width } = Dimensions.get('screen')

const Container = styled(ViewPager)`
	height: ${height}px;
`

const Center = styled.View`
	flex: 1;
	flex-direction: row;
`



const Hero = (props) => {
	const [selected, setSelected] = useState(0)
	const min = selected - 1 >= 0 ? selected - 1 : 0
	const max = selected + 1 
	
	useEffect(() => {
		
		console.log("Video Time Before Load on Videoplayer", new Date().getTime())

		if((props.videos.length) - (selected+1) < 2){
			props.getMoreProperties()
		}
		console.log("App State", AppState.currentState)
	}, [selected])
	const [pause, setPause] = useState(true)
	useEffect(() => {

		const unsubscribeFocus = props.navigation.addListener('didFocus', () => {
		  setPause(true);
		console.log("Video Time when onFocus", new Date().getTime())

		});
	
		const unsubscribeBlur = props.navigation.addListener('didBlur', () => {
		  setPause(false);
		});
	
		return () => {
		  unsubscribeFocus.remove();
		  unsubscribeBlur.remove();
		};
	  }, [props.navigation]);
	  const items = props.videos.map((item, index) => {
				console.log("Select and Index", index, selected, selected == index,pause)
				return <View key={index}>
					{index === selected || index === selected - 1 || index === selected + 1 || index === selected - 2 || index === selected + 2 ? <PropertyDetail property={item} shouldPlay={selected == index && pause} navigation={props.navigation} video={true} />: null}
				</View>

			})
	  
	return(
		<Viewport.Tracker>
	<Container orientation='vertical'
		onPageScroll={({ nativeEvent }) => 
{		console.log("Video Time when changing screen ", new Date().getTime(), nativeEvent.position)
			
			 setSelected(nativeEvent.position)}
		  }

		
		initialPage={0}>
			{items}
		</Container>
		</Viewport.Tracker>
	)
}

export default Hero;