import React, { useEffect, useState } from 'react'

import { Dimensions, View,Text , StyleSheet, AppState} from 'react-native'

// import { LinearGradient } from 'expo-linear-gradient'

import styled from 'styled-components/native'

import ViewPager from '@react-native-community/viewpager'

import PropertyDetail from '../../property/Detail';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview'
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Viewport} from '@skele/components'


// import { super } from 'jscodeshift'
const { height, width } = Dimensions.get('screen')

const Container = styled(ViewPager)`
	height: ${height}px;
`

const Center = styled.View`
	flex: 1;
	flex-direction: row;
`


// export class Hero extends React.Component{
// 	constructor(props){
// 		super(props)
// 		console.log("Props inside Contructor", props.videos.length)
// 		this.state = {
// 			videos: props.videos,
// 			dataProvider: new DataProvider((r1,r2) => {
// 				return r1 != r2
// 			}).cloneWithRows(props.videos),
// 			layoutProvider: new LayoutProvider(() => {
// 				return 'VSEL' // Since we only have one view type
// 			}, (type, dim,index) => {
// 				switch(type){
// 					case 'VSEL':
// 						dim.width = width,
// 						dim.height = height
// 						break;
// 					default:
// 						dim.width = width;
// 						dim.heigh = height;
// 				}
// 			}),
// 			selected: 0

// 		}
// 		this.rowRenderer = this.rowRenderer.bind();
// 		this.onEndReached = this.onEndReached.bind()

// 	}
	
// 	onEndReached = () => {
// 		this.props.getMoreProperties()
// 		if(this.state.videos.length > this.props.videos.length){
// 			this.setState({videos: this.props.videos, dataProvider: new DataProvider((r1,r2) => {
// 				return r1 != r2
// 			}).cloneWithRows(props.videos),})
// 		}
// 	}

// 	rowRenderer = (type, data) => {
// 		//We have only one view type so not checks are needed here	
// 		// console.log("Data to Repeat", data)
// 		return <PropertyDetail property={data} shouldPlay={true} navigation={this.props.navigation}  />;
// 	  };
// 	render(){
// 		return(
// 		<RecyclerListView
// 			style={{height: '100%'}}
// 			dataProvider={this.state.dataProvider}
// 			layoutProvider={this.state.layoutProvider}
// 			rowRenderer={this.rowRenderer}
// 			// onScroll={e => e.nativeEvent.contentOffset.y> 700 ? this.setState({selected: e.nativeEvent.contentOffset.y}) : null}
// 			pagingEnabled={true}
// 			onEndReached={this.onEndReached}
// 		/>	
// 		)
// 	}	
// }


const Hero = (props) => {
	const [selected, setSelected] = useState(0)
	const min = selected - 1 >= 0 ? selected - 1 : 0
	const max = selected + 1 
	// console.log("Hero Props",  props)
	useEffect(() => {
		console.log("Videos Length", props.videos)

		if((props.videos.length) - (selected+1) < 2){
			props.getMoreProperties()
		}
		console.log("App State", AppState.currentState)
	}, [selected])
	const [pause, setPause] = useState(true)
	useEffect(() => {
		// dispatch(clearNewProperty())
		const unsubscribeFocus = props.navigation.addListener('didFocus', () => {
		  setPause(true);
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
				// return <View>
				// 	<Text>Index No {index}</Text>
				// 	<Text>Selected</Text>
				// </View>
			})
	  
	return(
		<Viewport.Tracker>
	<Container orientation='vertical'
		onPageScroll={({ nativeEvent }) => 
			 setSelected(nativeEvent.position)
		  }

		// onPageSelected={e => setSelected(e.nativeEvent.position)}
		initialPage={0}>
			{items}
		</Container>
		</Viewport.Tracker>
	)
}

export default Hero;