import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { logout } from './../../services/apiService';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); // Ajout de l'état isLoading

  const handleLogout = async () => {
    setIsLoading(true); // Définir isLoading à true au début de la déconnexion
    // Afficher une alerte de confirmation
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
          onPress: () => setIsLoading(false), // Réinitialiser isLoading si l'utilisateur annule
        },
        {
          text: 'Déconnexion',
          onPress: async () => {
            try {
              await logout(); // Appeler la fonction de déconnexion
              // Rediriger l'utilisateur vers l'écran de connexion par exemple
              navigation.navigate('PinScreen');
              // navigation.navigate('Login');
            } catch (error) {
              console.error('Error logging out:', error);
            } finally {
              setIsLoading(false); // Réinitialiser isLoading une fois la déconnexion terminée
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionHeadingMain}>
            <Text style={styles.sectionHeadingText} numberOfLines={1}>
              Profile
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cardContainer}>
          <View style={styles.logoCard}>
            <Image
              style={styles.logo}
              source={require('./../../assets/logo/logopme.png')}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <View style={styles.profileAction}>
          <View style={styles.separator} />
         <TouchableOpacity
         onPress={() => navigation.navigate('Generale')}
         style={styles.nav}
         >
           <MaterialIcons name="description" size={24} color="black" style={{paddingTop:5, marginRight:5}} />
          <Text style={styles.titreProfilDetail}>Données génerales</Text>
         </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
         onPress={() => navigation.navigate('IdentificationCommer')}
         style={styles.nav}
         >
           <MaterialIcons name="business" size={24} color="black" style={{paddingTop:5, marginRight:5}} />
          <Text style={styles.titreProfilDetail}>Activite/ identification commerciale</Text>
         </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
         onPress={() => navigation.navigate('personnels')}
         style={styles.nav}
         >
           <MaterialIcons name="people" size={24} color="black" style={{paddingTop:5, marginRight:5}} />
          <Text style={styles.titreProfilDetail}>Personnels</Text>
         </TouchableOpacity>
         <View style={styles.separator} />
         <TouchableOpacity
         onPress={() => navigation.navigate('DirigeantProprietaire')}
         style={styles.nav}
         >
          <MaterialIcons name="person" size={24} color="black" style={{paddingTop:5, marginRight:5}} />
          <Text style={styles.titreProfilDetail}>Dirigeant/proprietaire</Text>
         </TouchableOpacity>
         <View style={styles.separator}/>
         <TouchableOpacity
         onPress={() => navigation.navigate('ChangePasswordScreen')}
         style={styles.nav}
         >
          <MaterialIcons name="build" size={24} color="black" style={{paddingTop:5, marginRight:5}} />
          <Text style={styles.titreProfilDetail}>Change mot de passe</Text>
         </TouchableOpacity>
         <View style={styles.separator}/>

         <TouchableOpacity onPress={handleLogout}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#009900" />
            ) : (
              <Text style={styles.logoutButton}>Déconnexion</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
