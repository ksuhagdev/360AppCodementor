import Video from 'react-native-video';
import {View, StyleSheet, } from 'react-native'
import styled from 'styled-components/native'


const Play = styled(Video)`
height: 100%
`

const VideoPlayer = ({video,poster, isPlay}) => {
    return  <Play 
    repeat={true}
    source={{ uri: getMainVideo(property.videos).video_url }}
    poster={getMainVideo(property.videos).thumbnail_url}
    onBuffer={onBuffer}
    onLoad={onLoad}
    posterResizeMode="cover"
    resizeMode={'cover'}
    paused={currentIndex !== index || !shouldPlay}
    volume={1}
    ignoreSilentSwitch="ignore"
    style={styles.backgroundVideo}
    playInBackground={false}
        />
    
}

export default VideoPlayer
