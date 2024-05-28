import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login } from './../../services/apiService'; 
import {SendOtp} from './../../services/apiService';
import styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginPage = () => { 
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // État pour suivre le chargement

  // Fonction qui extrait les IntituleType des types d'entreprise
const getIntituleTypes = (typesEntreprise) => {
  // Extrait les IntituleType du tableau de typesEntreprise
  return typesEntreprise.map((type) => type.type_entreprise.IntituleType);
};

  const handleSubmit = async () => {
    try {
      setLoading(true); // Activer le chargement
      // Appel de la fonction login du service API
      const response = await login(email, password);



    // Extraire et stocker les IntituleType des types d'entreprise
    const intituleTypes = getIntituleTypes(response.data.typesEntreprise);
    await AsyncStorage.setItem('@intituleTypes', JSON.stringify(intituleTypes));
    
    // console.log('IntituleTypes stockés:', intituleTypes);


      // Gérer la réponse de l'API selon vos besoins
      // console.log('Réponse de l\'API:', response.data.user);
      console.log('code Mpme:', response.data.user.Entreprises);
      await AsyncStorage.setItem('code_Mpme', response.data.user.Entreprises);

      const otpResponse = await SendOtp(email); // Premier appel à SendOtp
      // Afficher le code OTP dans la console
      //console.log('Code OTP envoyé:', otpResponse.code);
      // Désactiver le chargement
      setLoading(false);
      // Naviguer vers l'écran OTPScreens après la connexion réussie et passer l'e-mail de l'utilisateur
      navigation.navigate('BottomTabNavigator',{screen: 'Accueil'}, { email: email });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      // Désactiver le chargement
      setLoading(false);
      setErrorMessage('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
      // Réinitialiser le message d'erreur après 3 secondes
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      const otpResponse = await SendOtp(email); // Deuxième appel à SendOtp en cas d'erreur
      // Afficher le code OTP dans la console
      //console.log('Code OTP envoyé:', otpResponse.code);
    }
  };
  
  return (
     <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
      <ScrollView vertical={true} showsVerticalScrollIndicator={true}>
        <View style={styles.loginTop}>
          <Image
            style={styles.loginTopLogo}
            source={require('./../../assets/logo/logopme.png')}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.connexion}>Connexion</Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.MesInput}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Adresse e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                rightIcon={<MaterialCommunityIcons name="email" size={24} color="black" />}
              />

              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Mot de passe"
                keyboardType="numeric"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.btnModifierMission}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!email || !password}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.TextBtn}>Se connecter</Text>
                  )}
                </TouchableOpacity>
              </View>
              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}
            </View>
          </KeyboardAvoidingView>
          


          <TouchableOpacity
         onPress={() => navigation.navigate('DemandeOtorisation')}
         style={styles.button}
         activeOpacity={0.7} 
         >
      <Text style={styles.buttonText}>S'inscrire</Text>
         </TouchableOpacity>


        </ScrollView>
      </View>
     </SafeAreaView>
  );
};

export default LoginPage;
