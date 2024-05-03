import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { reconnectWithPin } from './../../services/apiService'; // Importer la fonction de connexion avec le code PIN
import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_LENGTH = 8;

const PinInput = ({ onPinComplete }) => {
  const [pin, setPin] = useState('');

  const handleChange = (text) => {
    if (text.length <= PIN_LENGTH) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Vibration légère lors de la saisie
      setPin(text);
      if (text.length === PIN_LENGTH) {
        onPinComplete(text); // Appeler la fonction lorsque le code PIN est complet
      }
    }
  };

  const renderPinCircles = () => {
    const circles = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      circles.push(
        <View key={i} style={styles.pinCircle}>
          {i < pin.length ? <View style={styles.filledCircle} /> : null}
        </View>
      );
    }
    return circles;
  };

  return (
    <View style={styles.pinInputContainer}>
      <TextInput
        value={pin}
        onChangeText={handleChange}
        keyboardType="numeric"
        secureTextEntry
        style={styles.hiddenInput}
        autoFocus
      />
      <TouchableOpacity>
        <View style={styles.circlesContainer}>
          {renderPinCircles()}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const PinScreen = () => {
  const navigation = useNavigation();

  const handlePinComplete = async (pin) => {
    try {
      // Utiliser la fonction pour se connecter avec le code PIN
      const response = await reconnectWithPin(pin);

      if (response) {
        navigation.navigate('BottomTabNavigator'); // Rediriger vers HomeScreen après une connexion réussie
      } else {
        Alert.alert('Connexion échouée', 'Veuillez réessayer.'); // Gestion de l'échec de la connexion
      }
    } catch (error) {
      console.error('Erreur lors de la connexion avec le code PIN :', error);
      Alert.alert('Erreur', 'La connexion a échoué. Veuillez réessayer.'); // Message d'erreur général
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Entrez votre code PIN :</Text>
      <PinInput onPinComplete={handlePinComplete} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinCircle: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  filledCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0,
  },
});

export default PinScreen;
