import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, RefreshControl, Animated, TextInput, Modal, TouchableOpacity } from 'react-native';
import { GetStockHistorics } from './../../services/stock.Service';
import { MaterialIcons } from '@expo/vector-icons';

const StockHistorics = () => {
  const [historics, setHistorics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredHistorics, setFilteredHistorics] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toastAnimation = useRef(new Animated.Value(0)).current;

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = historics.filter(item =>
      item?.historics?.[0]?.stock_produit?.produit?.NomProduit.toLowerCase().includes(text.toLowerCase())
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
        renderItem={renderGridItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {errorMessage ? (
        <Animated.View style={[styles.toastContainer, { opacity: toastAnimation }]}>
          <Text style={styles.toastText}>{errorMessage}</Text>
        </Animated.View>
      ) : null}
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
              {/* <Text style={styles.stockInfo}>Unité: {selectedProduct?.historics?.[0]?.stock_produit?.produit?.unite?.Symbol || 'Inconnu'}</Text> */}
              <Text style={styles.stockInfo}> Description:</Text>
              <Text > {selectedProduct?.historics?.[0]?.stock_produit?.produit?.Description || 'Description Inconnue'}</Text>
              <Text style={styles.stockInfo}>Quantité Réelle:</Text>
              <Text > {selectedProduct.QuantiteReel} {selectedProduct?.historics?.[0]?.stock_produit?.produit?.unite?.Symbol || 'Inconnu'}</Text>
              {/* <Text style={styles.stockInfo}>Forme: {selectedProduct?.historics?.[0]?.stock_produit?.produit?.forme?.Nom || 'Inconnu'}</Text> */}
              <Text style={styles.stockInfo}>Date de Mise à Jour: </Text>
              <Text > {selectedProduct.DateDeMiseAJourStock}</Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    minHeight: 70,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16, // Espace entre les rangées
  },
  historicItem: {
    flex: 1,
    padding: 16,
    margin: 4,
    alignItems: 'center', // Centre l'image et le texte
  },
  productImage: {
    width: 100, // Ajustez la taille selon vos besoins
    height: 100, // Ajustez la taille selon vos besoins
    borderRadius: 50, // Assure que l'image est ronde
    marginBottom: 8, // Espace entre l'image et le texte
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stockInfo: {
    fontSize: 14,
    marginVertical: 4,
    color:'#009900'
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#009900'
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#009900',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StockHistorics;
