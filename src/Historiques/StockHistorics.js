import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, RefreshControl, Animated, TextInput } from 'react-native';
import { GetStockHistorics } from './../../services/stock.Service';
import { MaterialIcons } from '@expo/vector-icons';

const StockHistorics = () => {
  const [historics, setHistorics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toastAnimation = useRef(new Animated.Value(0)).current; 
  const [searchText, setSearchText] = useState('');
  const [filteredHistorics, setFilteredHistorics] = useState([]);


  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = historics.filter(item =>
      item.historics[0]?.stock_produit?.produit?.NomProduit.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredHistorics(filteredData);
  };

  const showToast = (message) => {
    setErrorMessage(message);
    Animated.timing(toastAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        hideToast();
      }, 3000); // Le toast restera visible pendant 3 secondes
    });
  };

  const hideToast = () => {
    Animated.timing(toastAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setErrorMessage(''));
  };

  const fetchStockHistorics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await GetStockHistorics();
      setHistorics(data.data);
      setFilteredHistorics(data.data); // Initialise les données filtrées avec toutes les données
      hideToast(); // Cache le toast s'il était affiché avant
      // console.log('historics',data.data);
    } catch (error) {
      console.error(error);
      showToast('Erreur de chargement. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Arrête le rafraîchissement si nécessaire
    }
  }, []);
  

  useEffect(() => {
    fetchStockHistorics(); // Chargement initial des données
  }, [fetchStockHistorics]);

  const onRefresh = () => {
    setRefreshing(true); // Active le rafraîchissement
    fetchStockHistorics(); // Charge à nouveau les données
  };

  const renderHistoricItem = ({ item }) => {
    const product = item.historics[0]?.stock_produit?.produit || {};
    return (
      <View style={styles.historicItem}>
         {product.ImageProduit ? (
          <Image
            source={{ uri: product.ImageProduit }}
            style={styles.productImage}
          />
        ) : (
          <Text style={styles.noImageText}>Aucune image disponible</Text>
        )}
        <Text style={styles.productName}>{product.NomProduit || 'Produit Inconnu'}</Text>
        <Text style={styles.stockInfo}>{product.Description || 'Description Inconnu'}</Text>
        <Text style={styles.stockInfo}>Quantité Réelle: {item.QuantiteReel}</Text>
        <Text style={styles.stockInfo}>Date de Mise à Jour: {item.DateDeMiseAJourStock}</Text>
       
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#009900" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <Text style={styles.sectionHeadingText} numberOfLines={1}>
            Mes Stocks
          </Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.searchbar}
          placeholder="Rechercher un produit"
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>
      <FlatList
        data={filteredHistorics}
        renderItem={renderHistoricItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {errorMessage ? (
        <Animated.View style={[styles.toastContainer, { opacity: toastAnimation }]}>
          <Text style={styles.toastText}>{errorMessage}</Text>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 30,
    paddingHorizontal: 24,
    marginBottom: 10
  },
  sectionHeadingMain: {
    flexShrink: 1,
  },
  sectionHeadingText: {
    fontSize: 24,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  historicItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockInfo: {
    fontSize: 14,
    marginVertical: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  noImageText: {
    color: '#999',
    marginTop: 8,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  toastText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dddddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchbar: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
  },
});

export default StockHistorics;
