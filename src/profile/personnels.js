import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, FlatList, Text, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';
import { getUserData } from './../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Personnels = ({ navigation }) => {
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
        <Text style={styles.ListContentEspace}>Personnel Permanent Femme: {userData && userData.data && userData.data.detail && typeof userData.data.detail.PersonnelPermanentFemme === 'number' ? userData.data.detail.PersonnelPermanentFemme : "Données non disponibles"}</Text>
          <View style={styles.separator}></View>
        </TouchableOpacity >
        <TouchableOpacity style={styles.List}>
        <Text style={styles.ListContentEspace}>Personnel Permanent Homme: {userData && userData.data && userData.data.detail && typeof userData.data.detail.PersonnelPermanentHomme === 'number' ? userData.data.detail.PersonnelPermanentHomme : "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
        </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
       <Text style={styles.ListContentEspace}>Nombre Employe: {userData && userData.data && userData.data.detail && typeof userData.data.detail.NbreEmploye === 'number' ? userData.data.detail.NbreEmploye : "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
       <Text style={styles.ListContentEspace}>Nombre d'employe femme: {userData && userData.data && userData.data.detail && typeof userData.data.detail.NbreEmployeGuinneF === 'number' ? userData.data.detail.NbreEmployeGuinneF : "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
       <Text style={styles.ListContentEspace}>Nombre d'employe homme: {userData && userData.data && userData.data.detail && typeof userData.data.detail.NbreEmployeGuinneH === 'number' ? userData.data.detail.NbreEmployeGuinneH : "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
       <Text style={styles.ListContentEspace}>Nombre actionnaire guinnée homme: {userData && userData.data && userData.data.detail && typeof userData.data.detail.NbreActionnaireGuinneH === 'number' ? userData.data.detail.NbreActionnaireGuinneH : "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
       <Text style={styles.ListContentEspace}>Nombre actionnaire guinnée femme: {userData && userData.data && userData.data.detail && typeof userData.data.detail.NbreEmployeGuinneF === 'number' ? userData.data.detail.NbreEmployeGuinneF : "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
       </TouchableOpacity>
       <TouchableOpacity style={styles.List}>
       <Text style={styles.ListContentEspace}>Nombre actionnaire : {userData && userData.data && userData.data.detail && typeof userData.data.detail.NbreActionnaire === 'number' ? userData.data.detail.NbreActionnaire : "Données non disponibles"}</Text>
        <View style={styles.separator}></View>
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
              Personnel
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

export default Personnels;
