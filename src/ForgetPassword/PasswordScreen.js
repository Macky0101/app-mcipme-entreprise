import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator,ScrollView ,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { changePassword, logout } from './../../services/apiService';
import Toast from '../compoment/Toast';


const PIN_LENGTH = 8;

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPasswordTouched, setOldPasswordTouched] = useState(false);
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message) => {
    setErrorMessage(message);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
    setErrorMessage('');
  };

  const navigation = useNavigation();

  const handleChange = (text, setter) => {
    if (text.length <= PIN_LENGTH) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setter(text);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(oldPassword, newPassword, confirmPassword);
      await logout(); // Supprimer le token après le changement de mot de passe
      
      Alert.alert('Succès', 'Le mot de passe a été changé.');
      hideToast();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'PinScreen' }],
        })
      );
    } catch (error) {
      Alert.alert('Erreur', 'Le changement de mot de passe a échoué.');
      showToast('Erreur de chargement. Vérifiez votre connexion internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonEnabled = 
    /^\d{8}$/.test(oldPassword) &&
    /^\d{8}$/.test(newPassword) &&
    /^\d{8}$/.test(confirmPassword);

  const shouldDisplayInfoText = (password, touched) => {
    return !/^\d{8}$/.test(password) && touched; // Afficher seulement si ce n'est pas 8 chiffres
  };

  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.container}
>
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<ScrollView style={{paddingTop:'15%'}}>
<View style={styles.screen}>
      <Text style={styles.title}>Changer le mot de passe</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ancien mot de passe"
          keyboardType="numeric"
          secureTextEntry
          maxLength={PIN_LENGTH}
          value={oldPassword}
          onChangeText={(text) => handleChange(text, setOldPassword)}
          onFocus={() => setOldPasswordTouched(true)}
          style={styles.pinInput}
        />
        {shouldDisplayInfoText(oldPassword, oldPasswordTouched) && (
          <Text style={styles.warningText}>Doit contenir 8 chiffres</Text>
        )}
        <TextInput
          placeholder="Nouveau mot de passe"
          keyboardType="numeric"
          secureTextEntry
          maxLength={PIN_LENGTH}
          value={newPassword}
          onChangeText={(text) => handleChange(text, setNewPassword)}
          onFocus={() => setNewPasswordTouched(true)}
          style={styles.pinInput}
        />
        {shouldDisplayInfoText(newPassword, newPasswordTouched) && (
          <Text style={styles.warningText}>Doit contenir 8 chiffres</Text>
        )}
        <TextInput
          placeholder="Confirmer le nouveau mot de passe"
          keyboardType="numeric"
          secureTextEntry
          maxLength={PIN_LENGTH}
          value={confirmPassword}
          onChangeText={(text) => handleChange(text, setConfirmPassword)}
          onFocus={() => setConfirmPasswordTouched(true)}
          style={styles.pinInput}
        />
        {shouldDisplayInfoText(confirmPassword, confirmPasswordTouched) && (
          <Text style={styles.warningText}>Doit contenir 8 chiffres</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={handlePasswordChange}
        style={[
          styles.button,
          { backgroundColor: isButtonEnabled ? '#009900' : '#015A01' },
        ]}
        disabled={!isButtonEnabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Changer le mot de passe</Text>
        )}
      </TouchableOpacity>
      <Toast visible={toastVisible} message={errorMessage} onDismiss={hideToast} />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinInput: {
    backgroundColor: '#dddddd',
    borderRadius: 25,
    width: 320,
    height: 50,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 15,
  },
  warningText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChangePasswordScreen;
