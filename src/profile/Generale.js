import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, FlatList, Text, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';
import { getUserData } from './../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Generale = ({ navigation }) => {
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
          <Text style={styles.ListContentEspace}>Nom de l'entreprise: {item.data.detail.SigleMpme || "Données non disponibles"}</Text>
          <View style={styles.separator}></View>
        </TouchableOpacity >
        <TouchableOpacity style={styles.List}>
           <Text>Nom Dirigeant: {item.data.detail.PrenomDirigeant || "Données non disponibles"} {item.data.detail.NomDirigeant || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
        </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Date de création: {item.data.detail.AnneeCreation || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Numero WhatsApp: {item.data.detail.NumeroWhatsApp || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Numero secondaire: {item.data.detail.NumeroTelephoneSecondaire || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Adresse Email: {item.data.detail.AdresseEmail || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Pays du Siege Social: {item.data.detail.PaysSiegeSocial || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
        <Text>Region: {userData.data.detail.region.NomRegion || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.List}>
        <Text>Commune: {userData.data.detail.commune.NomSousPrefecture || "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
          <Text>Quartier: {userData.data.detail.quartier.NomQuartier || "Données non disponibles"}</Text>
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
              Données generale
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

export default Generale;
