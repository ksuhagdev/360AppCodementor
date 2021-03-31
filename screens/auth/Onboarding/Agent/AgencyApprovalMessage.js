import React, { useState, useEffect } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';

import { View, Text } from 'react-native';
import * as acc from '../../../../actions/account-actions';
import GradientButton from '../../../../components/Button';
import {useDispatch, useSelector} from 'react-redux'
const AgencyApprovalMessage = (props) => {
    const dispatch = useDispatch();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ textAlign: 'center', width: '80%', fontSize: 30, fontWeight: 'bold' }}> We have sent you an email, kindly press on the verification link. After your verification will start the approval process and notify you once approved</Text>
            <GradientButton
                style={{ marginTop: 20, width: 300 }} onPress={() => {
    //                 const loginUser = StackActions.reset({
    //   index: 0,
    //   // actions: [NavigationActions.navigate({ routeName: data.user.role })],
    //   actions: [NavigationActions.navigate({ routeName: 'USER'})],

    // });

    // navigation.dispatch(loginUser);
    let data = {
        username: props.navigation.getParam('username'), password: props.navigation.getParam('password')
    }
    dispatch(acc.agentLogin(data, props.navigation))
    
                }}
            >Done</GradientButton>
        </View>
    )
}


export default AgencyApprovalMessage;