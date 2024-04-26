import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../src/Login/loginPge';
import HomeScreen from '../src/home/HomeScreen';
import OTPScreen from '../src/VerifiCodeOpt/verifieCodeOpt';
import BottomTabNavigator from './../src/tabs/TabNavigator';
import Generale from './../src/profile/Generale';
import IdentificationCommer from './../src/profile/IdentificationCommer';
import Personnels from './../src/profile/personnels';
import DirigeantProprietaire from './../src/profile/dirigeantProprietaire';
import DetailCommande from './../src/home/DeatailCommand';
import AddCommandeScreen from './../src/home/AjoutCommand';
import DemandeOtorisation from './../src/Demande/DemandeOtorisation';


const Stack = createNativeStackNavigator();

const Routes = () => {
  const [initialRoute, setInitialRoute] = useState("Login"); // Par défaut, définir Login comme écran initial
  const [isLoading, setIsLoading] = useState(true); // Ajouter un état pour gérer le chargement initial

  // Vérifier si le token existe
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('@token');
    console.log('Token:', token); // Afficher le token dans la console
    if (token) {
      setInitialRoute("BottomTabNavigator"); // Si le token existe, définir BottomTabNavigator comme écran initial
    }
    setIsLoading(false); // Mettre fin au chargement après avoir vérifié le token
  }

  useEffect(() => {
    checkToken();
  }, []);

  // Attendre la fin du chargement avant de rendre la navigation
  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="OTPScreens" component={OTPScreen} />
        <Stack.Screen name="Generale" component={Generale} />
        <Stack.Screen name="IdentificationCommer" component={IdentificationCommer} />
        <Stack.Screen name="personnels" component={Personnels} />
        <Stack.Screen name="DirigeantProprietaire" component={DirigeantProprietaire} />
        <Stack.Screen name="DetailCommande" component={DetailCommande} />
        <Stack.Screen name="AddCommandeScreen" component={AddCommandeScreen} />
        <Stack.Screen name="DemandeOtorisation" component={DemandeOtorisation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
