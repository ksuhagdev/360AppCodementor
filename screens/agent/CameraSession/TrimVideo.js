import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
// import MultiSlider from 'react-native-multi-slider'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import RangeSlider from 'rn-range-slider';
import { RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg'
import RNFS from 'react-native-fs';
class TrimVideo extends Component {
    static navigationOptions = {
        title: 'Trim Video',
        headerMode: 'none',
        headerShown: false,
    };
    
    constructor(props) {
        super(props);
        this.state = {
            multiSliderValue: [0, 10],
            timefrom: 0,
            timeto:15,
            videoDuration: 1,
           video: Platform.OS === 'android' ? 'file://'+this.props.navigation.getParam('videoPath') : this.props.navigation.getParam('videoUri')
        }
    }
    
    componentDidMount() {
        this.deleteVideoCache()
        console.log("TRIM Video for", this.props.navigation.getParam('videoPath'));
    }
    onload = (data) => {
        if (data.duration > 15) {

            var time = data.duration
            var delta = (time - 1 / 9)
            var s = time.toString();
            var parts = s.split(":");
            var minutes = 60 * parseInt(parts[0]) + parseInt(parts[1]);
            console.log("Normalized time", minutes)
            this.setState({ multiSliderValues: [0, 15], videoDuration: delta }, () => { console.log("Slider End Value", this.state.multiSliderValues) })
        } else {
            var time = data.duration
            this.setState({ multiSliderValues: [0, 15], videoDuration: delta }, () => { console.log("Slider End Value", this.state.multiSliderValues) })
        }
        // var time = data.duration.split(':')

    }
    deleteVideoCache = async () => {
        
        const outputVideoPath = `${RNFS.CachesDirectoryPath}/output.mp4`;
        
    
        try {
          
          const outputVideoExists = await RNFS.exists(outputVideoPath);
         
    
         
          if (outputVideoExists) {
            await RNFS.unlink(outputVideoPath);
          }
    
         
        } catch (error) {
          console.error('RNFS file deletion error: ', error);
        }
      };
    trimVideo = async () => {
        var fromhours = Math.floor(this.state.multiSliderValue[0]/3600);
        var frommins = Math.floor(this.state.multiSliderValue[0]/60)
        var fromseconds = this.state.multiSliderValue[0]/60
        var tohours = Math.floor(this.state.multiSliderValue[1]/3600);
        var tomins = Math.floor(this.state.multiSliderValue[1]/60)
        var toseconds = this.state.multiSliderValue[1]%60
        var fromTime = fromhours + ':'+frommins+':'+fromseconds
        var toTime = tohours + ':' + tomins + ':' + toseconds
        console.log("From Time", fromTime, toTime)
        const outputUri = `${RNFS.CachesDirectoryPath}/output30.mp4`;
        const fftrimCommand = ['-y','-ss', `${fromTime}`, '-i',  this.state.video, '-to', `${toTime}`,'-c', 'copy',outputUri]
        try{
            const result = await RNFFmpeg.executeWithArguments(fftrimCommand)
            this.props.navigation.navigate('EditVideo', {
                videoUri: this.state.path,
                Trim: true,
                videoOutput: outputUri,
                values: {
                    startTime: fromTime,
                    toTime: toTime
                },
                videoType: this.props.navigation.getParam('videoType')
              });
            console.log("Result",result);
        }catch(e){
            console.log("Error while triming Video",e);
        }  
     }


    multiSliderValuesChange = values => {
        console.log("Changes Value ", values)
        this.setState({
            multiSliderValue: values,
        })
        this.setState({
            
        })
        var fromhours = Math.floor(this.state.multiSliderValue[0]/3600);
        var frommins = Math.floor(this.state.multiSliderValue[0]/60)
        var fromseconds = this.state.multiSliderValue[0]/60
        var tohours = Math.floor(this.state.multiSliderValue[1]/3600);
        var tomins = Math.floor(this.state.multiSliderValue[1]/60)
        var toseconds = this.state.multiSliderValue[1]%60
        var fromTime = fromhours + ':'+frommins+':'+fromseconds
        var toTime = tohours + ':' + tomins + ':' + toseconds
        console.log("From Time", fromTime, toTime)

        //this.props.callback(values)
    }
    render() {
        const videoUri = this.props.navigation.getParam('videoUri')
        return (
            <View style={styles.videoContainer}>
                <Video
                    source={{ uri: videoUri }}
                    ref={videoRef => {
                        this.player = videoRef;
                    }}
                    resizeMode="cover"
                    onLoad={this.onload}
                    style={{ height: Dimensions.get('window').height / 2, width: '100%', padding: 40, }}
                />
                <View style={styles.container}>
                    {/* <TouchableOpacity><Text style={{color:'#fff'}}>jd</Text></TouchableOpacity> */}
                    <View style={{ margin: 20, width: 280, height: 150, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                            <Text style={{ fontSize: 20, color: '#fff' }}>{this.state.multiSliderValue[0]} </Text>
                            <Text style={{ fontSize: 20, color: '#fff' }}>{this.state.multiSliderValue[1]}</Text>
                        </View>
                        <MultiSlider
                            markerStyle={{
                                ...Platform.select({
                                    ios: {
                                        height: 30,
                                        width: 30,
                                        shadowColor: '#000000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 3
                                        },
                                        shadowRadius: 1,
                                        shadowOpacity: 0.1
                                    },
                                    android: {
                                        height: 30,
                                        width: 30,
                                        borderRadius: 50,
                                        backgroundColor: '#1792E8'
                                    }
                                })
                            }}
                            pressedMarkerStyle={{
                                ...Platform.select({
                                    android: {
                                        height: 30,
                                        width: 30,
                                        borderRadius: 20,
                                        backgroundColor: '#148ADC'
                                    }
                                })
                            }}
                            selectedStyle={{
                                backgroundColor: '#1792E8'
                            }}
                            trackStyle={{
                                backgroundColor: '#CECECE'
                            }}
                            touchDimensions={{
                                height: 40,
                                width: 40,
                                borderRadius: 20,
                                slipDisplacement: 40
                            }}
                            values={[this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
                            sliderLength={280}
                            onValuesChange={this.multiSliderValuesChange}
                            step={0.1}
                            min={0}
                            max={this.state.videoDuration}
                            allowOverlap={false}
                            minMarkerOverlapDistance={50}
                        />
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={this.trimVideo}><Text style={{color:'#fff', fontSize: 30}}>Next</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        display: 'flex',
        backgroundColor: '#000'
    }, container: {
        // justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingTop: 80,
        margin: 20,
        width: 280,
    },
})
export default TrimVideo;