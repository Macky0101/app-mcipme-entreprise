import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import axios from 'axios';
import { ListProduits, GetStockHistorics } from './../../services/stock.Service';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BarChartImportation from './statistiqueCommand';
import { format } from 'date-fns';
import Toast from '../compoment/Toast';

const Accueil = () => {
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [commandesValidees, setCommandesValidees] = useState(0);
  const [commandesEnAttente, setCommandesEnAttente] = useState(0);
  const [latestCommandDate, setLatestCommandDate] = useState('');
  const [userNom, setUserNom] = useState('');
  const [produits, setProduits] = useState([]);
  const [stockHistorics, setStockHistorics] = useState([]);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredHistorics, setFilteredHistorics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

      if (commandes.length > 0) {
        const latestCommande = commandes.reduce((latest, current) => {
          return new Date(current.DateCommande) > new Date(latest.DateCommande) ? current : latest;
        });
        setLatestCommandDate(format(new Date(latestCommande.DateCommande), 'dd/MM/yyyy'));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  const fetchStockHistorics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GetStockHistorics();
      const sortedHistorics = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentHistorics = sortedHistorics.slice(0, 3);
      setStockHistorics(recentHistorics);
      setFilteredHistorics(recentHistorics); // Initialise les données filtrées avec toutes les données
      hideToast(); // Cache le toast s'il était affiché avant
    } catch (error) {
      console.error('Erreur lors de la récupération des historiques de stock:', error);
      showToast('Erreur de chargement. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Arrête le rafraîchissement si nécessaire
    }
  }, []);

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

  useFocusEffect(
    React.useCallback(() => {
      fetchCommandesData();
      fetchStockHistorics();
    }, [fetchStockHistorics])
  );

  const renderHistoricItem = ({ item }) => {
    const product = item?.historics?.[0]?.stock_produit?.produit || {};
    return (
      <TouchableOpacity style={styles.historicItem} onPress={() => setSelectedProduct(item)}>
        <Image
          source={{ uri: product.ImageProduit }}
          style={styles.productImage}
        />
        <Text style={styles.productName}>{product.NomProduit || 'Produit Inconnu'}</Text>
      </TouchableOpacity>
    );
  };

  const renderGridItem = ({ item, index }) => {
    if (index % 3 !== 0) return null; // Nous ne rendons que le premier élément de chaque ligne

    return (
      <View style={styles.row}>
        {filteredHistorics.slice(index, index + 3).map((subItem, subIndex) => (
          <View key={index + subIndex} style={{ flex: 1 }}>
            {renderHistoricItem({ item: subItem })}
          </View>
        ))}
      </View>
    );
  };

  const renderHeader = () => (
    <View>
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
      <View style={styles.container}>
        <View style={styles.walletContainer}>
          <View style={styles.mestotaux}>
            <View style={styles.contenttotaux}>
              <Text style={styles.walletText}>Commandes</Text>
              <Text style={styles.walletAmount}>{totalCommandes}</Text>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.contenttotaux}>
              <Text style={styles.walletText}>Validées</Text>
              <Text style={styles.walletAmount}>{commandesValidees}</Text>
            </View>
            <View style={styles.separator}></View>
            <View style={styles.contenttotaux}>
              <Text style={styles.walletText}>En attente</Text>
              <Text style={styles.walletAmount}>{commandesEnAttente}</Text>
            </View>
          </View>
          <Text style={styles.walletCard}>Date de la dernière commande: {latestCommandDate}</Text>
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
        </View>
      </View>
    </View>
  );
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <BarChartImportation/>
    </View>
  );
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={filteredHistorics}
        renderItem={renderGridItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={renderFooter} 
      />

      {selectedProduct && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedProduct(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedProduct?.historics?.[0]?.stock_produit?.produit?.NomProduit || 'Produit Inconnu'}</Text>
              {selectedProduct?.historics?.[0]?.stock_produit?.produit?.ImageProduit ? (
                <Image
                  source={{ uri: selectedProduct.historics[0].stock_produit.produit.ImageProduit }}
                  style={styles.productImage}
                />
              ) : (
                <Text style={styles.noImageText}>Aucune image disponible</Text>
              )}
              <Text style={styles.stockInfo}> Description:</Text>
              <Text > {selectedProduct?.historics?.[0]?.stock_produit?.produit?.Description || 'Description Inconnue'}</Text>
              <Text style={styles.stockInfo}>Quantité Réelle:</Text>
              <Text > {selectedProduct.QuantiteReel} {selectedProduct?.historics?.[0]?.stock_produit?.produit?.unite?.Symbol || 'Inconnu'}</Text>
              <Text style={styles.stockInfo}>Date de Mise à Jour: </Text>
              <Text > {selectedProduct.DateDeMiseAJourStock}</Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <Toast visible={toastVisible} message={errorMessage} onDismiss={hideToast} />
    </SafeAreaView>
  );
};

export default Accueil;
