import React from 'react';
//import { createAppContainer } from 'react-navigation'
//import AppNav from './Src/Routes/AppNav'
import { Provider } from 'mobx-react'
import TimeingStore from './Src/Stores/TimeingStore'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './Src/Screens/Login';
import Register from './Src/Screens/Manager/Register';
import Report from './Src/Screens/Student/Report';
import Notifications from './Src/Screens/Student/Notifications';
import ScholarshipList from './Src/Screens/ScholarshipList';
import EditScholarship from './Src/Screens/Manager/EditScholarship';
import StudentRegistration from './Src/Screens/Student/StudentRegistration';
import ManagementPage from './Src/Screens/Manager/ManagementPage';
import WatchingHours from './Src/Screens/Student/WatchingHours';
import AddScholarshipPage from './Src/Screens/Manager/AddScholarshipPage';
import EditStudent from './Src/Screens/Manager/EditStudent';
import Messages from './Src/Screens/Messages';
class App extends React.Component {
  render() {
    return (
      <Provider TimeingStore={TimeingStore}>
        {/* <AppContainer /> */}
        <App2 />
      </Provider>
    );
  }
}
export default App;
//const AppContainer = createAppContainer(AppNav);
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="ScholarshipList">
      <Drawer.Screen
        name="ScholarshipList"
        component={ScholarshipList}
        options={{ drawerLabel: 'ScholarshipList' }}
      />
      <Drawer.Screen
        name="EditScholarship"
        component={EditScholarship}
        options={{ drawerLabel: 'EditScholarship' }}
      />
      <Drawer.Screen
        name="StudentRegistration"
        component={StudentRegistration}
        options={{ drawerLabel: 'StudentRegistration' }}
      />
      <Drawer.Screen
        name="Login"
        component={Login}
        options={{ drawerLabel: 'Login' }}
      />
      <Drawer.Screen
        name="Register"
        component={Register}
        options={{ drawerLabel: 'Register' }}
      />
      <Drawer.Screen
        name="Report"
        component={Report}
        options={{ drawerLabel: 'Report' }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{ drawerLabel: 'Notifications' }}
      />
      <Drawer.Screen
        name="ManagementPage"
        component={ManagementPage}
        options={{ drawerLabel: 'ManagementPage' }}
      />
      <Drawer.Screen
        name="WatchingHours"
        component={WatchingHours}
        options={{ drawerLabel: 'WatchingHours' }}
      />
      <Drawer.Screen
        name="AddScholarshipPage"
        component={AddScholarshipPage}
        options={{ drawerLabel: 'AddScholarshipPage' }}
      />
      <Drawer.Screen
        name="EditStudent"
        component={EditStudent}
        options={{ drawerLabel: 'EditStudent' }}
      />
      <Drawer.Screen
        name="Messages"
        component={Messages}
        options={{ drawerLabel: 'Messages' }}
      />
    </Drawer.Navigator>
  );
}


const App2 = () => {
  return (
    <NavigationContainer>
      <MyDrawer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Report" component={Report} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="ScholarshipList" component={ScholarshipList} />
          <Stack.Screen name="EditScholarship" component={EditScholarship} />
          <Stack.Screen name="StudentRegistration" component={StudentRegistration} />
          <Stack.Screen name="ManagementPage" component={ManagementPage} />
          <Stack.Screen name="WatchingHours" component={WatchingHours} />
          <Stack.Screen name="AddScholarshipPage" component={AddScholarshipPage} />
          <Stack.Screen name="EditStudent" component={EditStudent} />
          <Stack.Screen name="Messages" component={Messages} />
        </Stack.Navigator>
      </MyDrawer>
    </NavigationContainer>
  );
}
