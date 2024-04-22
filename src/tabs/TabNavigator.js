import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './../home/HomeScreen';
import ProfileScreen from './../profile/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

function BottomTabNavigator () {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#009900"
      barStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
    > 
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Stock',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="archive" color={color} size={26} />
          ),
        }}
      />
       <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


export default BottomTabNavigator;
