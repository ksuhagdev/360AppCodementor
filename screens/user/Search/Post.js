import React from 'react';
import {View, Text} from 'react-native';
import {Video} from 'expo-av'

const Post = ({item}) => {
console.log("POst ", item)
    const getMainVideo = videos => {
        let video = null;
        console.log("Videos List", videos)
        if (videos && videos.length) {
          video = videos.find(vid => {
            return vid.video_type === 'main';
          });
    
          // console.log("Main Video", video)
    
          if (!video) {
            video = videos[0]; // assign random video instead
          }
        }
    
        return video;
      };

    return(
        <View style={{ 
            width: '100%',
            height: '100%',
        }}>
            <Video 
            source={{uri: 'https://d3qk4bte9py5ck.cloudfront.net/22f07bcf-d12e-40c4-ae17-57dc245b3706/hls/54-dev.m3u8' }}
            rate={1.0}
            volume={1.0}
            shouldPlay={true}
            isMuted={false}
            resizeMode='cover'
            isLooping
            style={{
                width: '100%',
                height: '100%',
              }}
            />
            <Text>Text</Text>
        </View>
    )
}

export default Post