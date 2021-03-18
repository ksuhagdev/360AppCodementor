import React from 'react';
import {View, Text, StatusBar, StyleSheet, Image,ImageBackground, Dimensions, TouchableOpacity,TouchableHighlight, Alert} from 'react-native';
import Swiper from 'react-native-swiper';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'
import FadeIn from '@expo/react-native-fade-in-image'
const {width, height} = Dimensions.get('window')

export default class Obboarding extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
               {/* <Text> Onboarding </Text> */}
                <Swiper autoplay={true}>
                    <View style={styles.swiper}>
                        
                        <ImageBackground source={require('../../../assets/image/onboarding/back1.png')} style={styles.image}/>
                    </View>

                    <View style={styles.swiper}>
                        <ImageBackground source={require('../../../assets/image/onboarding/back2.png')} style={styles.image}/>
                    </View>

                    <View style={styles.swiper}>
                        <ImageBackground source={require('../../../assets/image/onboarding/back3.png')} style={styles.image}/>
                    </View>

                    <View style={styles.swiper}>
                        <ImageBackground source={require('../../../assets/image/onboarding/back4.jpg')} style={styles.image}/>
                    </View>
                </Swiper>
                {/* <View style={{position:'absolute', right: 20, top: 50}} >
                    <Text style={{fontSize: 20, color:'#fff', textDecorationLine:'underline' }} onPress={() => {this.props.navigation.navigate('AgentOnboarding')}}>Agent Login In</Text>
                </View> */}
                
                <View style={{ top:50, right:20, zIndex: 1, position:'absolute'}}> 
                <TouchableOpacity hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} onPress={() => {this.props.navigation.navigate('AgentOnboarding')}} >
                        <Text style={{fontSize: 20, color:'#fff',textDecorationLine:'underline'}}>Agent Access</Text>
                   </TouchableOpacity>
                </View>
                    
                <View style={styles.buttonContainer}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.signUpContainer} onPress={() => {this.props.navigation.navigate('AgencyApprovalMessage',{type:'userSignUp'})}}>
                        <Text style={styles.signUp}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7}  style={styles.logInContainer} onPress={() =>{this.props.navigation.navigate('PhoneVerification', {type:'userLogin'})}}>
                        <Text style={styles.login}>Log In</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={{position:'absolute', bottom:30, padding: 10, justifyContent: 'center'}} >
                    <Text style={{color:'white', textAlign:'center'}}> By clicking the buttons above. I agree to the <Text style={{textDecorationLine:'underline'}}>Terms of Use</Text> and acknowledge I have read the <Text style={{textDecorationLine:'underline'}}>Privacy Policy</Text>  </Text> 
                </View>
                <View style={styles.imageContainer}>
                    <Image resizeMode='contain' source={require('../../../assets/image/splash.png')} style={{width: 120, height: 120}}/>
                </View>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    container: {
        flex:1
    },  
   
    swiper: {
        // flex:1,
        alignItems: 'center',
        justifyContent: 'center',

    },image:{
        width: width, height: height
    },
    buttonContainer:{
         position: 'absolute',
         flexDirection:'row',
         bottom: 100,
         width:'90%', 
         padding: 10,
         height:60,
        //  marginLeft: 20,
        //  marginRight:20,
         alignItems: 'center', 
         justifyContent: 'space-between',
    },
    signUpContainer:{
         width: width/2-20,
         height:30,
         backgroundColor:'#fff',
         borderRadius:20,
         alignItems: 'center',
         justifyContent: 'center',
    },
    signUp:{
        fontFamily:'Helvetica',
   
        fontSize:16, 
        color:'#000'
    }, logInContainer:{
        width: width/2 - 20,
        marginLeft: 10,
        height:30,
        backgroundColor:'#fff',
        borderRadius:30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'#fff',
        borderWidth:2, 
   },login:{
    fontFamily:'Helvetica',
  
    fontSize:16, 
    color:'#000' 
   },imageContainer:{
       position:'absolute',
    //    bottom:10,
       width:'100%',
       left: 20,
       top:20
    //    justifyContent: 'center',
    //    alignItems: 'center',
   }
})