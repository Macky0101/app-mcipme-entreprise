import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { VerifyOtp } from './../../services/apiService'; // Importez la fonction VerifyOtp depuis le service API
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const OTPScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState('');

  const verifyAOTP = async () => {
    try {
      // Récupérez l'e-mail passé en paramètre
      const email = route.params.email;
      // Appelez la fonction VerifyOtp avec l'e-mail, la valeur et le code OTP
      const response = await VerifyOtp(email, email, otp);
      console.log('Réponse de vérification du code OTP:', response);
      
      // Vérifier si la réponse indique que la vérification du code OTP a réussi
      if (response.status === 'success') {
        // Le code OTP est correct, naviguez vers la page suivante
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabNavigator' }],
        });
        // navigation.navigate('BottomTabNavigator');
      } else {
        // Le code OTP est incorrect, affichez un message d'erreur à l'utilisateur
        alert('Le code OTP est incorrect. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code OTP:', error);
      // Gérez les erreurs ici
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification OTP</Text>
      <Text style={styles.subtitle}>Entrez le code que vous avez reçu</Text>
      <TextInput
        style={styles.input}
        onChangeText={setOtp}
        value={otp}
        keyboardType="numeric"
        placeholder="Entrez OTP"
      />
      <Button title="Vérifier" onPress={verifyAOTP} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
});

export default OTPScreen;
