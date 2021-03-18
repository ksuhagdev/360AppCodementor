import React,{useState} from 'react';
import { TextInput } from 'react-native-paper';
import { View, Text } from 'react-native';
import GradientButton from '../../../../components/Button';
import Icon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/AntDesign'
import {useDispatch, useSelector} from 'react-redux';
import * as acc from '../../../../actions/account-actions'
const AgencyDetail = (props) => {
    const [agencyName, setagencyName] = useState('');
    const [agencyEmail, setagencyEmail] = useState('');
    const [valid, setValid] = useState(false);
    const dispatch = useDispatch();
    return (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Enter Agency Name</Text>
            <TextInput
                label="Agency Name"
                style={{ width: '90%', color: '#FF3257', backgroundColor: '#fff', marginTop: 20 }}
                mode='outlined'
                autoCapitalize={false}
                value={agencyName}
                onChangeText={text => {
                    // SetPassword(text)
                    setagencyName(text)
                }
                }

            />

            <Text style={{ textAlign: 'center', width: '80%' }}> Your 'agency-name' will displayed with properties (This can be changed later). </Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold',marginTop: 50, }}>Enter Work (Agency) email</Text>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center',  flexDirection: 'row'}}>
                
                <TextInput
                    label="Work Email"
                    style={{ width: '90%', color: '#FF3257', backgroundColor: '#fff', marginTop: 20, borderColor: '#fff' }}
                    mode='outlined'
                    autoCapitalize={false}
                    value={agencyEmail}
                    onChangeText={text => {
                        // SetPassword(text)
                        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        if (reg.test(text) === false) {
                            console.log("Email is Not Correct");
                            setagencyEmail(text)
                            setValid(false)
                            return false;
                        }
                        else {
                            setagencyEmail(text)
                            setValid(true)
                            console.log("Email is Correct");
                        }
                    }
                    }

                />
                 <View style={{ position: 'absolute', right: 30, top: 40 }}>
                    {agencyEmail.length != 0 && (valid ? <Icons name="checkcircle" size={26} color='green' /> : <Icon name="circle-with-cross" size={26} color='red' />)}
                </View>

                

            </View>
            <Text style={{ textAlign: 'center', width: '80%' }}> We just need to verify your identity and agency </Text>
            <GradientButton
                style={{ marginTop: 20, width: 300 }} onPress={async () => {
                    let old_data = props.navigation.getParam('data')
                    let data = 
                        {
                            "user": {
                              "first_name": old_data.first_name,
                              "last_name": old_data.last_name,
                              "username": old_data.username,
                              "agent_email": agencyEmail,
                              "phone": old_data.phone,
                              "profile_photo_url": old_data.profile_photo_url
                            },
                            "agent": {
                              "title": agencyName,
                              "profile_description": "Agent6",
                              "linkedin_url": "https://www.linkedin.com/in/harinder-harry-pal-971867135/",
                              "instagram_url": "https://www.linkedin.com/in/harinder-harry-pal-971867135/",
                              "facebook_url": "https://www.linkedin.com/in/harinder-harry-pal-971867135/",
                              "twitter_url": "https://www.linkedin.com/in/harinder-harry-pal-971867135/",
                              "youtube_url": "https://www.linkedin.com/in/harinder-harry-pal-971867135/",
                              "profile_photo_url": old_data.profile_photo_url
                            },
                            "agency": {
                              "name": agencyName,
                              "address": "THEDS",
                              "agency_linkedin_profile_url": "https://www.linkedin.com/in/harinder-harry-pal-971867135/",
                              "agent_id": 0
                            },
                            "password": props.navigation.getParam('password')
                          }
                          await dispatch(acc.signupAsAgent(data,props.navigation))
                    props.navigation.navigate('AgencyApprovalMessage')}
                }
            >Done</GradientButton>

        </View>
    )
}

export default AgencyDetail