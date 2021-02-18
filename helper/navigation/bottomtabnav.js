import { createBottomTabNavigator } from 'react-navigation-tabs';

import NewProperty from '../../screens/agent/Property/NewProperty';;
import AgentHome from '../../screens/agent/AgentHome';
import UserProfile from '../../screens/agent/UserProfile';
import Search from '../../screens/user/Search';
import Inbox from '../../screens/user/Inbox';

export default createBottomTabNavigator({
    Home: {screen: AgentHome} ,
    User: {screen: UserProfile},
    Search: {screen: Search},
    Inbox: {screen: Inbox},
    Add: {screen: NewProperty}
},{
    initialRouteName: 'Home',
    activeTintColor: '#F44336'
})