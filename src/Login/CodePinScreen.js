import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, TextInput, Image, Platform, ActivityIndicator ,ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { reconnectWithPin } from './../../services/apiService'; // Importer la fonction de connexion avec le code PIN

const PIN_LENGTH = 8;

const PinInput = ({ onPinComplete }) => {
  const [pin, setPin] = useState('');

  const handleChange = (text) => {
    if (text.length <= PIN_LENGTH) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Vibration légère lors de la saisie
      }
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
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>

    <View style={styles.pinInputContainer}>
      {Platform.OS === 'ios' ? (
        <>
          <TextInput
            value={pin}
            onChangeText={handleChange}
            keyboardType="numeric"
            secureTextEntry
            style={styles.hiddenInput}
            autoFocus
          />
            <View style={styles.circlesContainer}>
              {renderPinCircles()}
            </View>
        </>
      ) : (
        <TextInput
          value={pin}
          onChangeText={handleChange}
          keyboardType="numeric"
          secureTextEntry
          maxLength={PIN_LENGTH}
          style={styles.androidTextInput}
          autoFocus
        />
      )}
    </View>
    </KeyboardAvoidingView>
  );
};

const PinScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); 

  const handlePinComplete = async (pin) => {
    setIsLoading(true); 
    try {
      const response = await reconnectWithPin(pin);

      if (response) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'BottomTabNavigator' }],
          })
        );
      } else {
        Alert.alert('Connexion échouée', 'Veuillez réessayer.');
        setPin('');
      }
    } catch (error) {
      Alert.alert('Erreur', 'La connexion a échoué. Veuillez réessayer.');
      setPin('');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.container}
>
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
   <ScrollView style={{padding:'10%'}} >
     <View style={styles.screen}>
      <Image
        style={styles.loginTopLogo}
        source={require('./../../assets/password-code.png')}
        resizeMode="contain"
      />
      <Text style={styles.title}>Entrez votre code PIN :</Text>
      <PinInput onPinComplete={handlePinComplete} />
      <View style={{marginTop:40}}>
      {isLoading && <ActivityIndicator size="large" color="#009900" />} 

      </View>
    </View>
   </ScrollView>
   </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
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
    marginBottom: 30,
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
  androidTextInput: {
    backgroundColor: '#dddddd', // Couleur d'arrière-plan
    borderRadius: 25, // Rond
    width: 250, // Largeur des cercles
    height: 50, // Hauteur des cercles
    textAlign: 'center', // Centrer le texte
    fontSize: 14, // Taille de la police
    // marginBottom: 15, // Espacement entre les cercles
  },
  loginTopLogo: {
    width: 250,
    height: 250,
    // marginBottom: 20,
  },
});

export default PinScreen;
