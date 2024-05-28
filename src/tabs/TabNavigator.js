import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, Easing } from 'react-native'; // Importation des animations Animated et Easing
import HomeScreen from './../home/HomeScreen';
import ProfileScreen from './../profile/ProfileScreen';
import Accueil from './../HomeScreen/Accueil';
import StockHistorics from './../Historiques/StockHistorics';

const Tab = createMaterialBottomTabNavigator();

function BottomTabNavigator() {
  const animatedValue = React.useRef(new Animated.Value(0)).current; // Référence à l'état de l'animation

  const handlePress = (index) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const iconStyle = (index) => ({
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8], // Déplacement vers le haut de 8 unités
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2], // Augmentation de la taille à 1.2x
        }),
      },
    ],
  });

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#009900"
      barStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
    >
      <Tab.Screen
        name="Accueil"
        component={Accueil}
        listeners={{
          tabPress: () => handlePress(0),
        }}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => (
            <Animated.View style={iconStyle(0)}>
              <MaterialCommunityIcons name="home" color={color} size={26} />
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        listeners={{
          tabPress: () => handlePress(1),
        }}
        options={{
          tabBarLabel: 'Commande',
          tabBarIcon: ({ color }) => (
            <Animated.View style={iconStyle(1)}>
              <MaterialCommunityIcons name="truck-fast" color={color} size={26} />
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="StockHistorics"
        component={StockHistorics}
        listeners={{
          tabPress: () => handlePress(2),
        }}
        options={{
          tabBarLabel: 'Stock',
          tabBarIcon: ({ color }) => (
            <Animated.View style={iconStyle(2)}>
              <MaterialCommunityIcons name="package-variant-closed" color={color} size={26} />
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        listeners={{
          tabPress: () => handlePress(3),
        }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Animated.View style={iconStyle(3)}>
              <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            </Animated.View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
