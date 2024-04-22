import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, FlatList, Text, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';
import { getUserData } from './../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IdentificationCommer = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState(null);
  // const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const [translateAnim] = useState(new Animated.Value(0));
  


  useEffect(() => {
    const fetchData = async () => {
      const codeMPME = await AsyncStorage.getItem('code_Mpme'); 
      const data = await getUserData(codeMPME);
      setUserData(data);
    };

    fetchData();
  }, []);


  useEffect(() => {
    Animated.timing(
      translateAnim,
      {
        toValue: 50, // La valeur finale de la translation
        duration: 1000, // Durée de l'animation en millisecondes
        useNativeDriver: true, // Utiliser le pilote natif pour les performances
      }
    ).start();
  }, []);

  const renderItem = ({ item }) => (
    <Animated.View style={{ transform: [{ translateY: translateAnim }] }}>
      <View style={styles.ListContent}>
        <TouchableOpacity  style={styles.List}>
          <Text style={styles.ListContentEspace}>Année de création: {item.data.detail.AnneeCreation || "Données non disponibles"}</Text>
          <View style={styles.separator}></View>
        </TouchableOpacity >
        <TouchableOpacity style={styles.List}>
           <Text>Année Entrée en Activité: {item.data.detail.AnneeEntreeActivite || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
        </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Code Statut Juridique: {item.data.detail.CodeStatutJuridique || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Secteur d'activité : {item.data.detail.secteur_activite?.NomSecteurActivite || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Sous Secteur d'activité: {item.data.detail.list_sous_secteurs?.NomSousSecteur || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Numéro NIF: {item.data.detail.NumeroNif || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Date Generation du Numero Nif: {item.data.detail.DateGenerationNif || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Numéro Rccm: {item.data.detail.NumeroRccm || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.List}>
        <Text>Document RCCM: {item.data.detail.FichierRccm  || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
          <Text>Numéro Tva: {item.data.detail.NumeroTva || "Données non disponibles"}</Text>
        </TouchableOpacity>     
      </View>
    </Animated.View>
  );
  
  

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: insets.top + 10,
          left: insets.left + 10,
          zIndex: 999,
          backgroundColor: '#ddd',
          borderRadius: 50,
          padding: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={34} color="black" />
      </TouchableOpacity>
      <View style={{ flex: 1, marginTop: insets.top + 80}}>
      <View style={styles.sectionHeading}>
          <View style={styles.sectionHeadingMain}>
          <Text style={styles.sectionHeadingText} numberOfLines={1}>
              Identification commercial 
            </Text>
          </View>
        </View>
        <FlatList
          data={userData ? [userData] : []}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default IdentificationCommer;
