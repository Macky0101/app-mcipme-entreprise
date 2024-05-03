import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics'; // Importer le module Haptics
import { useNavigation } from '@react-navigation/native';
import { changePassword } from './../../services/apiService';

const PIN_LENGTH = 8; // Même longueur que pour le code PIN

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleChange = (text, setter) => {
    if (text.length <= PIN_LENGTH) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Vibration légère
      setter(text);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await changePassword(oldPassword, newPassword, confirmPassword);
      Alert.alert('Succès', 'Le mot de passe a été changé.');
      navigation.goBack(); // Retour après le succès
    } catch (error) {
      Alert.alert('Erreur', 'Le changement de mot de passe a échoué.');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Changer le mot de passe</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ancien mot de passe"
          keyboardType="numeric" // Clavier numérique
          secureTextEntry
          maxLength={PIN_LENGTH} // Limiter à 8 caractères
          value={oldPassword}
          onChangeText={(text) => handleChange(text, setOldPassword)}
          style={styles.pinInput} // Forme ronde
        />
        <TextInput
          placeholder="Nouveau mot de passe"
          keyboardType="numeric"
          secureTextEntry
          maxLength={PIN_LENGTH}
          value={newPassword}
          onChangeText={(text) => handleChange(text, setNewPassword)}
          style={styles.pinInput}
        />
        <TextInput
          placeholder="Confirmer le nouveau mot de passe"
          keyboardType="numeric"
          secureTextEntry
          maxLength={PIN_LENGTH}
          value={confirmPassword}
          onChangeText={(text) => handleChange(text, setConfirmPassword)}
          style={styles.pinInput}
        />
      </View>
      <TouchableOpacity onPress={handlePasswordChange} style={styles.button}>
        <Text style={styles.buttonText}>Changer le mot de passe</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'column', // Placer les champs verticalement
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinInput: {
    backgroundColor: '#f5f5f5', // Couleur d'arrière-plan
    borderRadius: 25, // Rond
    width: 200, // Largeur des cercles
    height: 50, // Hauteur des cercles
    textAlign: 'center', // Centrer le texte
    fontSize: 20, // Taille de la police
    marginBottom: 15, // Espacement entre les cercles
  },
  button: {
    backgroundColor: '#3498db', // Couleur du bouton
    padding: 15, // Espacement du bouton
    borderRadius: 25, // Bords arrondis
  },
  buttonText: {
    color: '#fff', // Texte blanc
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChangePasswordScreen;
