import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { ListProduits, GetStockHistorics } from './../../services/stock.Service';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BarChartImportation from './statistiqueCommand';
import { format } from 'date-fns';
import Toast from '../compoment/Toast';

const Accueil = () => {
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [commandesValidees, setCommandesValidees] = useState(0);
  const [commandesEnAttente, setCommandesEnAttente] = useState(0);
  const [userNom, setUserNom] = useState('');
  const [produits, setProduits] = useState([]);
  const [stockHistorics, setStockHistorics] = useState([]);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (message) => {
    setErrorMessage(message);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
    setErrorMessage('');
  };

  const fetchCommandesData = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const response = await axios.get('https://bd-mcipme.org/bd-services/public/api/commandes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const commandes = response.data.data;

      const total = commandes.length;
      const valides = commandes.filter((commande) => parseInt(commande.CommandeValider, 10) === 1).length;
      const enAttente = commandes.filter((commande) => parseInt(commande.CommandeValider, 10) === 0).length;

      setTotalCommandes(total);
      setCommandesValidees(valides);
      setCommandesEnAttente(enAttente);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await ListProduits();
        const produitsRecents = response.data.slice(-3).reverse();
        setProduits(produitsRecents);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    const fetchUserNom = async () => {
      const storedNom = await AsyncStorage.getItem('@userNom');
      if (storedNom) {
        setUserNom(storedNom);
      }
    };

    fetchProduits();
    fetchUserNom();
    fetchCommandesData();
  }, []);

  const fetchStockHistorics = async () => {
    try {
      const response = await GetStockHistorics();
      if (Array.isArray(response.data)) {
        const sortedHistorics = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        const recentHistorics = sortedHistorics.slice(0, 3);
        setStockHistorics(recentHistorics);
      } else {
        console.error('GetStockHistorics n\'a pas retourné un tableau:', response.data);
      }
      hideToast();
    } catch (error) {
      showToast('Erreur de chargement. Vérifiez votre connexion internet.');
      console.error('Erreur lors de la récupération des historiques de stock:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCommandesData();
      fetchStockHistorics();
    }, [])
  );

  const currentDate = format(new Date(), 'dd/MM/yyyy');

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <Text style={styles.greetingText}>Bonjour</Text>
          <Text style={styles.userNameText}>{userNom}</Text>
        </View>
        <Image
          style={styles.logo}
          source={require('./../../assets/logo/logopme.png')}
          resizeMode="contain"
        />
      </View>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.walletContainer}>
            <Text style={styles.walletText}>Total Commandes</Text>
            <Text style={styles.walletAmount}>{totalCommandes}</Text>
            <Text style={styles.walletCard}>le: {currentDate}</Text>
          </View>
          <View style={styles.historicsContainer}>
            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>Mes Stocks</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'StockHistorics' })}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>voir +</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {stockHistorics.map((historic, index) => {
                const produit = historic.historics[0]?.stock_produit?.produit || {};
                return (
                  <View key={index} style={styles.historicBox}>
                    {produit.ImageProduit ? (
                      <Image
                        source={{ uri: produit.ImageProduit }}
                        style={styles.historicImage}
                      />
                    ) : (
                      <Text style={styles.noImageText}>Aucune image disponible</Text>
                    )}
                    <Text style={styles.productName}>{produit.NomProduit || 'Produit Inconnu'}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
        <BarChartImportation />
      </ScrollView>
      <Toast visible={toastVisible} message={errorMessage} onDismiss={hideToast} />
    </SafeAreaView>
  );
};

export default Accueil;
