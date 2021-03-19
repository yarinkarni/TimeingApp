import React from 'react';
//import { createAppContainer } from 'react-navigation'
//import AppNav from './Src/Routes/AppNav'
import { Provider } from 'mobx-react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Src/Screens/Login';
import Register from './Src/Screens/Manager/Register';
import Report from './Src/Screens/Student/Report';
import ScholarshipList from './Src/Screens/ScholarshipList';
import StudentRegistration from './Src/Screens/Student/StudentRegistration';
import ManagementPage from './Src/Screens/Manager/ManagementPage';
import WatchingHours from './Src/Screens/Student/WatchingHours';
import AddScholarshipPage from './Src/Screens/Manager/AddScholarshipPage';
import ApprovalOfScholarships from './Src/Screens/Manager/ApprovalOfScholarships';
import TimeingStore from './Src/Stores/TimeingStore';
import MassagesStudent from './Src/Screens/Student/MassagesStudent'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import ConfirmationOfHours from './Src/Screens/Manager/ConfirmationOfHours'

import { YellowBox, StyleSheet, Alert } from "react-native";
YellowBox.ignoreWarnings([""]);


async function createNotificationListeners() {
  const messageListener = firebase.messaging().onMessage((message) => {
  });
}

showAlert = (title, body) => {
  Alert.alert(
    title, body,
    [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}



componentDidMount = async () => {
  this.checkPermission();
  this.createNotificationListeners(); //add this line
  this.notificationListener();
  this.notificationOpenedListener();
}
// When a user tap on a push notification and the app is in background
async function backgroundNotificationListener() {
  messaging().onNotificationOpenedApp(async (data) => {
    alert("Background Push Notification opened")
  });
}
backgroundNotificationListener()
// When a user tap on a push notification and the app is CLOSED
async function closedAppNotificationListener() {
  messaging().getInitialNotification().then((remoteMessage) => {
    if (remoteMessage) {
      alert("App Closed Push Notification opened")
    }
  });
}
closedAppNotificationListener()
// When a user receives a push notification and the app is in foreground
onMessageListener = async () => {
  messaging().onMessage((data) => {
    this.showAlert(data.data.title, data.data.body)
  });
}
this.onMessageListener()





async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}
const Tab = createBottomTabNavigator();
requestUserPermission()
createNotificationListeners()

const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'דווח') {
            iconName = focused ? 'stopwatch-outline' : 'stopwatch-outline';
          }
          else if (route.name === 'צפייה בשעות') {
            iconName = focused ? 'alarm-outline' : 'alarm-outline';
          }
          else if (route.name === 'מלגות') {
            iconName = focused ? 'logo-reddit' : 'logo-reddit';
          }
          else if (route.name === 'הודעות') {
            iconName = focused ? 'chatbox-outline' : 'chatbox-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: '#fff',
        style: {
          backgroundColor: 'rgb(161, 128, 38)',
        },
        labelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen name="דווח" component={Report} />
      <Tab.Screen name="הודעות" component={MassagesStudent} />
      <Tab.Screen name="צפייה בשעות" component={WatchingHours} />
      <Tab.Screen name="מלגות" component={ScholarshipList} />
    </Tab.Navigator>
  );
}

class App extends React.Component {
  render() {
    return (
      <Provider TimeingStore={TimeingStore}>
        <App2 />
      </Provider>
    );
  }
}
export default App;
const Stack = createStackNavigator();

const titleStyle = {
  title: 'Timeing',
  headerStyle: {
    backgroundColor: '#FFFFFF',
  },
  headerTintColor: 'black',
  headerTitleStyle: {
    width: '80%',
    fontWeight: 'bold',
    textAlign: 'center',
  }
};

const App2 = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{
          title: titleStyle.title,
          headerStyle: titleStyle.headerStyle,
          headerTintColor: titleStyle.headerTintColor,
          headerTitleStyle: {
            width: '100%',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 20
          }
        }} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="StudentRegistration" component={StudentRegistration} options={{
          title: titleStyle.title,
          headerStyle: titleStyle.headerStyle,
          headerTintColor: titleStyle.headerTintColor,
          headerTitleStyle: titleStyle.headerTitleStyle
        }} />
        <Stack.Screen name="ManagementPage" component={ManagementPage} options={{
          title: titleStyle.title,
          headerStyle: titleStyle.headerStyle,
          headerTintColor: titleStyle.headerTintColor,
          headerTitleStyle: titleStyle.headerTitleStyle
        }} />
        <Stack.Screen name="AddScholarshipPage" component={AddScholarshipPage} options={{
          title: titleStyle.title,
          headerStyle: titleStyle.headerStyle,
          headerTintColor: titleStyle.headerTintColor,
          headerTitleStyle: titleStyle.headerTitleStyle
        }} />
        <Stack.Screen name="Menu" component={StudentTabNavigator} options={{
          title: titleStyle.title,
          headerStyle: titleStyle.headerStyle,
          headerTintColor: titleStyle.headerTintColor,
          headerTitleStyle: titleStyle.headerTitleStyle
        }} />
        <Stack.Screen name="ConfirmationOfHours" component={ConfirmationOfHours} options={{
          title: titleStyle.title,
          headerStyle: titleStyle.headerStyle,
          headerTintColor: titleStyle.headerTintColor,
          headerTitleStyle: titleStyle.headerTitleStyle
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}