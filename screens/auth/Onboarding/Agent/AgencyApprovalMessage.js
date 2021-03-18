import React, { useState, useEffect } from 'react';

import { View, Text } from 'react-native';

import GradientButton from '../../../../components/Button';

const AgencyApprovalMessage = (props) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ textAlign: 'center', width: '80%', fontSize: 30, fontWeight: 'bold' }}> We have sent you an email, kindly press on the verification link. After your verification will start the approval process and notify you once approved</Text>
            <GradientButton
                style={{ marginTop: 20, width: 300 }} onPress={() => props.navigation.popToTop()}
            >Done</GradientButton>
        </View>
    )
}


export default AgencyApprovalMessage;