import { createSwitchNavigator } from 'react-navigation'
import AddPost from '../Screens/Student/Report.js'
import Login from '../Screens/Login.js';
import Register from '../Screens/Register.js';



// import * as React from 'react';

// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';

// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();


// function MyDrawer() {
//   return (
//     <Drawer.Navigator initialRouteName="Login">
//       <Drawer.Screen
//         name="Log-Out"
//         component={LoginPage}
//         options={{
//           drawerLabel: 'התנתק'
//         }}
//       />
//       <Drawer.Screen
//         name="Login"
//         component={Login}
//         options={{ drawerLabel: () => null }}

//       />
//       <Drawer.Screen
//         name="Register"
//         component={Register}
//         options={{ drawerLabel: () => null }}
//       />
//     </Drawer.Navigator>
//   );
// }


// const AppSwitchNavigator =
//   <NavigationContainer>
//     <MyDrawer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Register" component={Register} />
//       </Stack.Navigator>
//     </MyDrawer>
//   </NavigationContainer>
// export default AppSwitchNavigator;





const AppSwitchNavigator = createSwitchNavigator({
    Login: { screen: Login },
    // Dashboard: { screen: Dashboard },
    AddPost: { screen: AddPost },
    Register: { screen: Register },


});
export default AppSwitchNavigator