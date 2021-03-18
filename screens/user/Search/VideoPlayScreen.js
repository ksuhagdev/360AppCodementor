import React, { useEffect, useState } from 'react'

import { Dimensions, View, FlatList ,Text , StyleSheet, AppState} from 'react-native'

// import { LinearGradient } from 'expo-linear-gradient'

import styled from 'styled-components/native'

import ViewPager from '@react-native-community/viewpager'

import PropertyDetail2 from '../../property/Detail/PropertyDetail2';
// import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview'
import {Viewport} from '@skele/components'
import {NavigationEvents} from 'react-navigation'
import Post from './Post'
// import { super } from 'jscodeshift'
const { height, width } = Dimensions.get('screen')

const Container = styled(ViewPager)`
	height: ${height}px;
	backgroundColor: black
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

const  VideoPlayScreen = (props) => {

	const data = props.navigation.getParam('data')
	const [scrolledIndex, setscrolledIndex] = useState(0)
	const _onViewableItemsChanged = ({viewableItems, changed}) => {
		console.log("Visible items are", viewableItems);
    	console.log("Changed in this iteration", changed);
		this.setState({playItem: changed.key})
		// const changed = props.changed;
		// changed.forEach((item) => {
		//   const cell = this.cellRefs[item.key];
		//   if (cell) {
		// 	if (item.isViewable) {
		// 	  cell.playVideoPlayer;
		// 	} else {
		// 	  cell.pause;
		// 	}
		//   }
		// });
	  };
	//   useEffect(() => {
	// 	const unsubscribeFocus = props.navigation.addListener('didFocus', () => {
	// 		// setVideoShouldPlay(true);
	// 	  });
	// 	  return () => {
	// 		unsubscribeFocus.remove();
	// 		// unsubscribeBlur.remove();
	// 	  };	  
	//   })

	   const onViewRef = (event) => {
		let index = 0;
		const scrollHeight = event.nativeEvent.layoutMeasurement.height;
		const currentScrollPos = event.nativeEvent.contentOffset.y;
	
		if (Number.isInteger(event.nativeEvent.contentOffset.y)) {
		  if (currentScrollPos >= scrollHeight) {
			index = currentScrollPos / scrollHeight;
		  }
		  setscrolledIndex(parseInt(index, 10))
		//   this.setState({
		// 	playItem: parseInt(index, 10),
		//   });
		}
	  };
	
	// render(){
		return (
			<View>
					<FlatList
					data={data}
					renderItem={({item, index}) => <PropertyDetail2 ref={(ref) => {
						this.cellRefs[item.id] = ref;
					  }} property={item} shouldPlay={scrolledIndex === index} navigation={props.navigation} video={true}/>}
					showsVerticalScrollIndicator={false}
					// onViewableItemsChanged={_onViewableItemsChanged}
					initialNumToRender={20}
					maxToRenderPerBatch={20}
					onScroll={onViewRef}
					getItemLayout={(_data, index) => ({
						        length: Dimensions.get('screen').height,
						        offset: Dimensions.get('screen').height * index,
						        index,
						      })}
					snapToInterval={Dimensions.get('window').height}
					snapToAlignment={'start'}
					decelerationRate={'fast'}
					/>
				</View>
		)
	// }
	
}

export default VideoPlayScreen;