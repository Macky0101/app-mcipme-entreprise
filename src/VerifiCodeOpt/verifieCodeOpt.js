import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { VerifyOtp } from './../../services/apiService'; // Assurez-vous d'importer correctement la fonction
import { useRoute, useNavigation } from '@react-navigation/native';

const OTPScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState('');

  const verifyAOTP = async () => {
    try {
      const email = route.params.email;
      const response = await VerifyOtp(email, email, otp);

      console.log('Réponse de vérification OTP:', response);

      if (response.status === 'success') {
        // Naviguer vers la page suivante
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabNavigator' }],
        });
      } else {
        // Afficher un message d'erreur
        Alert.alert('Erreur', 'Le code OTP est incorrect. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification OTP:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification OTP</Text>
      <Text style={styles.subtitle}>Entrez le code que vous avez reçu par e-mail</Text>
      
      <TextInput
        style={styles.input}
        onChangeText={setOtp}
        value={otp}
        keyboardType="numeric"
        placeholder="Entrez le code OTP"
        maxLength={6} // Limite à 6 caractères pour un OTP standard
      />
      
      <TouchableOpacity style={styles.button} onPress={verifyAOTP}>
        <Text style={styles.buttonText}>Vérifier</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5', // Couleur d'arrière-plan apaisante
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333', // Couleur de texte foncée
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666', // Couleur de texte plus claire
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5, // Coins arrondis
    paddingLeft: 10,
    backgroundColor: '#fff', // Couleur d'arrière-plan blanche
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#009900', // Couleur du bouton
    padding: 15,
    borderRadius: 7, // Coins arrondis
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff', // Couleur du texte blanche
  },
});

export default OTPScreen;
