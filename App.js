import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './Component/TabNavigator';
import Start from './Component/Start';
import Login from './Component/Login';
import Register from './Component/Register';
import Search from './Component/Search';
import Chat from './Component/Chat';
import Profil1 from './Component/Profil1';

const Stack = createStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
