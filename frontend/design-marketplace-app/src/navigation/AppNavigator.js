import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DesignDetails from '../screens/DesignDetails'; // Fixed import path
import BookingScreen from '../screens/BookingScreen'; // Placeholder for booking

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFF',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DesignDetails"
          component={DesignDetails}
          options={{
            title: 'Design Details',
            headerStyle: { backgroundColor: '#FFF' },
            headerTintColor: '#000',
          }}
        />
        <Stack.Screen
          name="BookingScreen"
          component={BookingScreen}
          options={{
            title: 'Book Design',
            headerStyle: { backgroundColor: '#FFF' },
            headerTintColor: '#000',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}