import React from 'react';
import {View} from 'react-native'
import Video from 'react-native-video';
import styles from './styles'

const Details = () => {
    return(
        <View style={styles.container}>
            <Video
            source={{uri: 'https://d3qk4bte9py5ck.cloudfront.net/770e4870-36c5-4a33-8b58-a22eef932a22/hls/45-dev.m3u8'}}
            style={styles.video}
            resizeMode={'cover'}
            repeat={true}
            />
        </View>
    )
}

export default Details