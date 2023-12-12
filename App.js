import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './Component/TabNavigator';
import Start from './Component/Start';
import Login from './Component/Login';
import Register from './Component/Register';
import Notifications from './Component/Notifications';
import EditProfile from './Component/EditProfile';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();


const UpdateNotifications=()=>{
            
  axios.get(`http://bookmate00-001-site1.atempurl.com/api/Followover/UpdateNotifications/${Id}`)
  .then((response) => {            
          console.log("Ovde");
          console.log(response.data);
      })
  .catch((error) => {
      console.error('Error fetching data:', error);
  })
}

export default function App() {
  return (
    <>
    <StatusBar style='auto'/>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start"
          component={Start}
          options={{
            headerShown: false, // Postavljanje headerShown na false
          }}
        />
        <Stack.Screen name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Register"
          component={Register}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="TabNavigator"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Notifications"
          component={Notifications}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}
