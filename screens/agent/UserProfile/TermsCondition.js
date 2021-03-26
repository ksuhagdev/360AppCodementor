import React from 'react';
import {View, Text} from 'react-native';
import PDFView from 'react-native-view-pdf/lib/index';
import {tc, privacy} from './T&C'


const TermsCondition = ({navigation}) => {
    const resourceType = 'base64';
    var type = navigation.getParam('type');
    console.log("type", type)
    const resources = {

        base64: type === 'tc'?tc:privacy
    }
    // console.log("PDF Base64", tc)
    return (
        <View style={{flex:1}}>
            <PDFView
            fadeInDuration={250.0}
            style={{ flex: 1 }}
            resource={resources[resourceType]}
            resourceType={resourceType}
            onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
            onError={(error) => console.log('Cannot render PDF', error)}
            />
        </View>
    )
}

export default TermsCondition