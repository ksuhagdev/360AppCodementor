import React, { useState, useEffect } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet , Dimensions} from 'react-native';
const defaultProfileImage = require('../../../../assets/image/default-profile-pic.png');
import { TextInput } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux'
import * as acc from '../../../../actions/account-actions'
import GradientButton from '../../../../components/Button';
import Axios from '../../../../utils/axios-plugin'
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';

const {width, height} =Dimensions.get('window')

const PersonalInfo = (props) => {
    const [profileImage, setProfileImage] = useState(defaultProfileImage)
    const [firstName, setFirstname] = useState('')
    const [lastName, setLastName] = useState('')
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const chooseFile = () => {
        let options = {
            mediaType: 'image/jpeg',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            // if (response.didCancel) {
            //   alert('User cancelled camera picker');
            //   return;
            // } else if (response.errorCode == 'camera_unavailable') {
            //   alert('Camera not available on device');
            //   return;
            // } else if (response.errorCode == 'permission') {
            //   alert('Permission not satisfied');
            //   return;
            // } else if (response.errorCode == 'others') {
            //   alert(response.errorMessage);
            //   return;
            // }
            console.log('base64 -> ', response.base64);
            console.log('uri -> ', response.uri);
            console.log('width -> ', response.width);
            console.log('height -> ', response.height);
            console.log('fileSize -> ', response.fileSize);
            console.log('type -> ', response.type);
            console.log('fileName -> ', response.fileName);
            if (response.uri) {
                // setProfileImage({ uri: response.uri });
                updateProfilePhoto(response.uri)
            }

        });
    };

    const updateProfilePhoto = async uri => {
        const formData = new FormData();
        const name = 'profile_pic.png';

        formData.append('photo', { uri, type: 'image/png', name });

        try {
            const { data } = await Axios({
                url: '/users/uploadProfilePhoto',
                method: 'POST',
                data: formData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Profile Image URL", data)
            setProfileImage({ uri: data.profile_photo_url });


        } catch (error) {
            console.log(error);
            handleSnackbar({ message: 'Profile picture could not be uploaded at this time. Please retry in a bit.' });
        }
    };


    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
            <View style={{ marginTop: 100, alignItems: 'center' }}>
                <Image style={styles.img} source={profileImage} />
                <TouchableOpacity onPress={() => chooseFile()}><Text style={{ color: 'grey', fontSize: 20, marginTop: 15 }}>Upload Profile Picture</Text></TouchableOpacity>


            </View>
            <View style={{ width: '90%',  marginTop: height/9 }}>
            <Text style={{ fontWeight:'bold'}}> First  Name </Text>

                <TextInput
                    placeholder="Type-in"
                    style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff' }}
                   // mode='outlined'
                    autoCapitalize={false}
                    value={firstName}
                    onChangeText={text => {
                        setFirstname(text)
                    }}

                />
                 <Text style={{marginTop:20, fontWeight:'bold'}}> Last  Name </Text>

                <TextInput
                    placeholder="Type-in"
                    style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff', marginTop: 20 }}
                  //  mode='outlined'
                    autoCapitalize={false}
                    value={lastName}
                    onChangeText={text => {
                        setLastName(text)
                    }
                    }

                />
                {props.navigation.getParam('type') == 'agentSignUp' && <TextInput
                    label="Password"
                    style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff', marginTop: 20 }}
                    mode='outlined'
                    autoCapitalize={false}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={text => {
                        setPassword(text)
                    }
                    }

                />}

                {props.navigation.getParam('type') == 'agentSignUp' && <TextInput
                    label="Confirm Password"
                    style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff', marginTop: 20 }}
                    mode='outlined'
                    autoCapitalize={false}
                    value={confirmPassword}
                    secureTextEntry={true}
                    onChangeText={text => {
                        setConfirmPassword(text)
                    }
                    }

                />}

                <GradientButton
                    style={{ marginTop: 20, width: 400 }} onPress={() => {
                        console.log("USER ", props.navigation.getParam('type'))
                        // if (props.navigation.getParam('type') == 'agentSignUp') {
                        //     props.navigation.navigate('Password', { mobno: props.navigation.getParam('mobno'), username: props.navigation.getParam('username') })
                        // }
                        if (props.navigation.getParam('type') == 'agentSignup') {
                            let data = {
                                "first_name": firstName,
                                "last_name": lastName,
                                "username": props.navigation.getParam('username'),
                                "phone": props.navigation.getParam('mobno'),
                                "profile_photo_url": profileImage.uri
                            }

                            props.navigation.navigate('Password', {data: data})
                        }
                        if (props.navigation.getParam('type') == 'userSignUp') {

                            let data = {
                                "first_name": firstName,
                                "last_name": lastName,
                                "username": props.navigation.getParam('username'),
                                "phone": props.navigation.getParam('mobno').substring(1),
                                "profile_photo_url": profileImage.uri

                            }

                            dispatch(acc.signupAsUser(data, props.navigation))

                        }
                    }
                    }
                >{props.navigation.getParam('type') == 'agentSignup' ? "Next" : "SignUp"} Continue  </GradientButton>

                {/* <GradientButton
                    style={{ marginTop: 100, width: 300 }} onPress={() => {
                        props.navigation.popToTop()
                    }}

                >Exit</GradientButton> */}
            </View>


        </View>
    )
}


const styles = StyleSheet.create({
    img: {

        borderRadius: 50,
        height: 150,
        justifyContent: 'center',
        // marginRight: 13,
        width: 150,

    }
})

export default PersonalInfo