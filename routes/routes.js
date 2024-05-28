import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../src/Login/loginPge';
import PinScreen from '../src/Login/CodePinScreen';

import Accueil from '../src/HomeScreen/Accueil';
import HomeScreen from '../src/home/HomeScreen';
import OTPScreen from '../src/VerifiCodeOpt/verifieCodeOpt';
import BottomTabNavigator from './../src/tabs/TabNavigator';
import Generale from './../src/profile/Generale';
import IdentificationCommer from './../src/profile/IdentificationCommer';
import Personnels from './../src/profile/personnels';
import DirigeantProprietaire from './../src/profile/dirigeantProprietaire';
import DetailCommand from './../src/home/DeatailCommand';
import AddCommandeScreen from './../src/home/AjoutCommand';
import DemandeOtorisation from './../src/Demande/DemandeOtorisation';
import ChangePasswordScreen from './../src/ForgetPassword/PasswordScreen';
import ModifyCommandeScreen from'./../src/home/ModifierCommand';
import StockHistorics from'./../src/Historiques/StockHistorics';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const [initialRoute, setInitialRoute] = useState("Login"); // Par défaut, définir Login comme écran initial
  const [isLoading, setIsLoading] = useState(true); // Ajouter un état pour gérer le chargement initial

  const checkEmail = async () => {
    const email = await AsyncStorage.getItem('@userEmail');
    const token = await AsyncStorage.getItem('@token');
    console.log('Vérification après déconnexion :');
    console.log('Token:', token); // Afficher le token dans la console
    console.log('Email stocké:', email); // Afficher l'email dans la console
    if (token) {
      setInitialRoute("BottomTabNavigator"); // Redirige vers le dashboard ou l'écran principal
    } else if (email) {
      setInitialRoute("PinScreen"); // Redirige vers la page de connexion avec code PIN
    } else {
      setInitialRoute("Login"); // Redirige vers la page de connexion avec email et mot de passe
    }

    setIsLoading(false); // Le chargement est terminé
  };
  useEffect(() => {
    checkEmail(); // Vérifiez l'email au démarrage
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
        <Stack.Screen name="PinScreen" component={PinScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="OTPScreens" component={OTPScreen} />
        <Stack.Screen name="Generale" component={Generale} />
        <Stack.Screen name="IdentificationCommer" component={IdentificationCommer} />
        <Stack.Screen name="personnels" component={Personnels} />
        <Stack.Screen name="DirigeantProprietaire" component={DirigeantProprietaire} />
        <Stack.Screen name="DetailCommand" component={DetailCommand} />
        <Stack.Screen name="AddCommandeScreen" component={AddCommandeScreen} />
        <Stack.Screen name="DemandeOtorisation" component={DemandeOtorisation} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="ModifyCommandeScreen" component={ModifyCommandeScreen} />
        <Stack.Screen name="StockHistorics" component={StockHistorics} />
        <Stack.Screen name="Accueil" component={Accueil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
