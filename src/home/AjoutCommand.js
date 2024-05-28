import React, { useEffect, useState ,useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ListProduits, ListFournisseurs, AjoutCommand, getCategories, getSubCategories, getProducts } from './../../services/stock.Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './stylesAjoutcommand';
import SearchableDropdown from 'react-native-searchable-dropdown';
import axios from 'axios';
import CountryFlag from 'react-native-country-flag';

// Fonction pour récupérer les types d'entreprise de AsyncStorage
const fetchIntituleTypes = async () => {
  const intituleTypesJson = await AsyncStorage.getItem('@intituleTypes');
  return intituleTypesJson ? JSON.parse(intituleTypesJson) : [];
};

const AddCommandeScreen = ({ route, navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des catégories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = useCallback(async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const response = await getSubCategories(category.id);
      setSelectedCategory({ ...category, children: response.data });
      setSelectedSubCategory(null); // Réinitialise la sous-catégorie sélectionnée
      setProducts([]); // Réinitialise la liste des produits
    } catch (error) {
      setError('Erreur lors de la récupération des sous-catégories');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubCategorySelect = useCallback(async (subCategory) => {
    setSelectedSubCategory(subCategory);
    setLoading(true);
    try {
      const response = await getProducts();
      const filteredProducts = response.data.filter(product => product.CategorieProduit === subCategory.id.toString());
      setProducts(filteredProducts);
    } catch (error) {
      setError('Erreur lors de la récupération des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  const renderCategoryItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory && selectedCategory.id === item.id && styles.activeCategory,
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={styles.categoryText}>{item.NomCategorieProduit}</Text>
    </TouchableOpacity>
  ), [handleCategorySelect, selectedCategory]);

  const renderSubCategoryItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleSubCategorySelect(item)} style={styles.subCategoryItem}>
      <Text style={styles.subCategoryText}>{item.NomCategorieProduit}</Text>
    </TouchableOpacity>
  ), [handleSubCategorySelect]);

  const renderProductItem = useCallback(({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedProduct(item)}
      style={[
        styles.productItem,
        selectedProduct && selectedProduct.id === item.id && { backgroundColor: '#ccc' }, // Style pour l'élément sélectionné
      ]}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productText}>{item.NomProduit}</Text>
        <Text style={styles.productUnit}>{item.unite.Nom} ({item.unite.Symbol})</Text>
      </View>
      <Image
        source={{ uri: item.ImageProduit }}
        style={styles.productImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  ), [selectedProduct]);
  

  let filteredChildren = [];
  if (selectedCategory && selectedCategory.children) {
    filteredChildren = selectedCategory.children.filter(child => {
      return child.CategorieProduitsId === selectedCategory.id.toString(); // Filtrer selon l'ID de la catégorie principale
    });
  }



  const { isImporter } = route.params || {}; // Récupérer le paramètre
  const [showFournisseur, setShowFournisseur] = useState(!isImporter); // Afficher le fournisseur si ce n'est pas pour importer

  const [showPaysProvenance, setShowPaysProvenance] = useState(false); // État pour afficher le champ de sélection du pays de provenance
  const [paysProvenance, setPaysProvenance] = useState(''); // État pour stocker le pays de provenance sélectionné
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (item) => {
    setSelectedCountry(item.name); // Stocke le nom du pays sélectionné
    setPaysProvenance(item.id); // Stocke le code alpha-2 du pays sélectionné
  };
  

  const [commandeDate, setCommandeDate] = useState(new Date());
  const [isCommandeDatePickerVisible, setCommandeDatePickerVisible] = useState(false);
  const [items, setProduits] = useState([]);
  const [produitList, setProduitList] = useState([]);
  const [fournisseurList, setFournisseurList] = useState([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);

  const [isFournisseurModalVisible, setFournisseurModalVisible] = useState(false);
  const [isProduitModalVisible, setProduitModalVisible] = useState(false);

  const [mpmeFour, setMpmeFour] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all?lang=fr');
      const countriesData = response.data;
      const sortedCountries = countriesData.sort((a, b) => {
        return a.translations.fra.common.localeCompare(b.translations.fra.common);
      });
      setCountries(sortedCountries);
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
    }
  };

  useEffect(() => {
    const getMpmeFourier = async () => {
      const codeMPME = await AsyncStorage.getItem('codeMPMEs');
      if (isImporter) {
        setMpmeFour(codeMPME);
      }
    };
    getMpmeFourier();
  }, [showFournisseur]);

  const [newProduit, setNewProduit] = useState({
    ProduitId: '',
    DateImportation: new Date(),
    QuantiteCommande: '',
    QuantiteImporter: '',
    PaysDeProvenance: '',
  });
  const [isDateImportationPickerVisible, setDateImportationPickerVisible] = useState(false);

  // Charger les types d'entreprise et ajuster l'état
  useEffect(() => {
    const fetchData = async () => {
      const intituleTypes = await fetchIntituleTypes();
      if (intituleTypes.includes('ENTREPRISE IMPORTATRICE')) {
        setShowPaysProvenance(true);
      } else {
        setShowPaysProvenance(false);
      }

      if (intituleTypes.includes('ENTREPRISE DISTRIBUTRICE')) {
        setShowFournisseur(true);
      } else {
        setShowFournisseur(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const produitsData = await ListProduits();
        setProduitList(produitsData.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    fetchProduits();
  }, []);

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const fournisseursData = await ListFournisseurs();
        setFournisseurList(fournisseursData.data.filter((f) => f.pme));
      } catch (error) {
        console.error('Erreur lors de la récupération des fournisseurs:', error);
      }
    };

    fetchFournisseurs();
  }, []);

  const openFournisseurModal = () => {
    setFournisseurModalVisible(true);
  };

  const closeFournisseurModal = () => {
    setFournisseurModalVisible(false);
  };

  const openProduitModal = () => {
    setProduitModalVisible(true);
  };

  const closeProduitModal = () => {
    setProduitModalVisible(false);
  };

  const handleFournisseurSelect = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    closeFournisseurModal();
  };
  const handleAddProduct = () => {
    if (!selectedProduct) {
      Alert.alert('Erreur', 'Veuillez sélectionner un produit.');
      return;
    }
    if (!paysProvenance) {
      Alert.alert('Erreur', 'Veuillez sélectionner un pays de Provenance.');
      return;
    }
  
    const { DateImportation, QuantiteCommande, QuantiteImporter } = newProduit;
    if (!DateImportation || !QuantiteCommande || !QuantiteImporter ) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    const newProduct = {
      ProduitId: selectedProduct.id,
      DateImportation: DateImportation.toISOString().split('T')[0],
      QuantiteCommande: QuantiteCommande,
      QuantiteImporter: QuantiteImporter,
      CodeEntrepriseFournisseur: selectedFournisseur?.CodeMpme || mpmeFour,
      PaysDeProvenance: newProduit.PaysDeProvenance,
    };
  
    setProduits((prevProduits) => [...prevProduits, newProduct]);
    setNewProduit({
      ProduitId: '',
      DateImportation: new Date(),
      QuantiteCommande: '',
      QuantiteImporter: '',
      PaysDeProvenance: '',
    });
    setSelectedProduct(null); // Effacer le produit sélectionné
  };
  

  const handleSubmitCommande = async () => {
    if (!commandeDate) {
      Alert.alert('Erreur', 'Veuillez entrer une date de commande.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Erreur', 'Vous devez ajouter au moins un produit.');
      return;
    }

    const newCommande = {
      commandeDate: commandeDate.toISOString().split('T')[0],
      CodeMpme: selectedFournisseur?.CodeMpme || mpmeFour,
      PaysDeProvenance: paysProvenance,
      items,
    };
    console.log('Nouvelle commande:', newCommande);
    try {
      const response = await AjoutCommand(newCommande);
      Alert.alert('Succès', 'La commande a été ajoutée avec succès.');
      navigation.navigate('BottomTabNavigator', { screen: 'HomeScreen', params: { refresh: true } });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la commande:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'ajout de la commande.');
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = items.filter((item) => item.ProduitId !== productId);
    setProduits(updatedProducts);
  };

  const handleEditProduct = (productId) => {
    const productToEdit = items.find((item) => item.ProduitId === productId);
    setSelectedProduit(productToEdit);
    setNewProduit({
      ProduitId: productToEdit.ProduitId.toString(),
      DateImportation: new Date(productToEdit.DateImportation),
      QuantiteCommande: productToEdit.QuantiteCommande.toString(),
      QuantiteImporter: productToEdit.QuantiteImporter.toString(),
    });
    handleDeleteProduct(productId); // Supprime le produit de la liste après la sélection
  };

  const showDatePicker = (type) => {
    if (type === 'commande') {
      setCommandeDatePickerVisible(true);
    } else if (type === 'importation') {
      setDateImportationPickerVisible(true);
    }
  };

  const handleDateChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || (type === 'commande' ? commandeDate : newProduit.DateImportation);
    if (type === 'commande') {
      setCommandeDatePickerVisible(Platform.OS === 'ios');
      setCommandeDate(currentDate);
    } else if (type === 'importation') {
      setDateImportationPickerVisible(Platform.OS === 'ios');
      setNewProduit({ ...newProduit, DateImportation: currentDate });
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
      <View style={styles.header}>
            <Text style={styles.headerText}>Ajouter une Commande</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.submitButtonText}> + Produit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <Text>Date de la commande:</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => showDatePicker('commande')}
          >
            <Text>{commandeDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {isCommandeDatePickerVisible && (
            <DateTimePicker
              value={commandeDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) =>
                handleDateChange(event, selectedDate, 'commande')
              }
            />
          )}

          {!isImporter && (
            <>
              <Text>Fournisseur:</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={openFournisseurModal}
              >
                <Text>
                  {selectedFournisseur?.pme?.SigleMpme ||
                    'Sélectionnez un fournisseur'}
                </Text>
              </TouchableOpacity>
            </>
          )}

<Text>Produit :</Text>
<TouchableOpacity
  style={styles.button}
  onPress={openProduitModal}
>
  <Text>{selectedProduct ? selectedProduct.NomProduit : 'Sélectionnez un produit'}</Text>
</TouchableOpacity>


          <Text>Quantité Commandée:</Text>
          <TextInput
            style={styles.input}
            value={newProduit.QuantiteCommande}
            onChangeText={(text) =>
              setNewProduit({ ...newProduit, QuantiteCommande: text })
            }
            keyboardType="numeric"
            placeholder="Entrez la quantité commandée"
          />

          <Text>Date d'Importation:</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => showDatePicker('importation')}
          >
            <Text>
              {newProduit.DateImportation.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>
          {isDateImportationPickerVisible && (
            <DateTimePicker
              value={newProduit.DateImportation}
              mode="date"
              display="default"
              onChange={(event, selectedDate) =>
                handleDateChange(event, selectedDate, 'importation')
              }
            />
          )}

          <Text>Quantité Importée:</Text>
          <TextInput
            style={styles.input}
            value={newProduit.QuantiteImporter}
            onChangeText={(text) =>
              setNewProduit({ ...newProduit, QuantiteImporter: text })
            }
            keyboardType="numeric"
            placeholder="Entrez la quantité importée"
          />
          {isImporter && (
              <>
              <Text style={styles.label}>Pays de provenance</Text>
              <SearchableDropdown
                onTextChange={(text) => console.log(text)}
                onItemSelect={(item) => handleCountrySelect(item)}
                containerStyle={styles.dropdownContainer}
                textInputStyle={styles.dropdownTextInput}
                itemStyle={styles.dropdownItem}
                itemTextStyle={styles.dropdownItemText}
                itemsContainerStyle={styles.dropdownItemsContainer}
                items={countries.map((country) => ({
                  id: country.cca2,
                  name: country.translations.fra.common,
                }))}
                defaultIndex={0}
                placeholder="Sélectionner un pays"
                resetValue={false}
                underlineColorAndroid="transparent"
              />
              {selectedCountry && (
                <View style={styles.selectedCountryContainer}>
                  <Text style={styles.selectedCountryText}>Pays sélectionné: {selectedCountry}</Text>
                </View>
              )}
            </>
          
          )}
      


         <Modal
        visible={isFournisseurModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeFournisseurModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={fournisseurList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleFournisseurSelect(item)}>
                  <Text> {item.pme.SigleMpme}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={closeFournisseurModal}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isProduitModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeProduitModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
          <FlatList
      style={styles.container}
      data={[{ key: 'categories', data: categories }, { key: 'filteredChildren', data: filteredChildren }, { key: 'products', data: products }]}
      renderItem={({ item }) => (
        <View style={styles.section}>
          {item.key === 'categories' && (
            <>
              <Text style={styles.title}>Sélectionnez une catégorie de produit</Text>
              {loading && <ActivityIndicator size="large" color="#009900" />}
              {error && <Text style={styles.error}>{error}</Text>}
              <FlatList
                data={item.data}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.categoryList}
                numColumns={2} // Afficher les catégories sur 2 colonnes
              />
            </>
          )}
          {item.key === 'filteredChildren' && selectedCategory && (
            <>
              <Text style={styles.sectionTitle}>Sous-catégories de {selectedCategory.NomCategorieProduit}</Text>
              <FlatList
                data={item.data}
                renderItem={renderSubCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.subCategoryList}
              />
            </>
          )}
          {item.key === 'products' && selectedSubCategory && (
            <>
              <Text style={styles.sectionTitle}>Produits de {selectedSubCategory.NomCategorieProduit}</Text>
              <FlatList
                data={item.data}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.productList}
              />
            </>
          )}
        </View>
      )}
      keyExtractor={(item) => item.key}
    />
            <TouchableOpacity style={styles.closeButton} onPress={closeProduitModal}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

        </View>
        <FlatList
          data={items}
          keyExtractor={(item) => item.ProduitId.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {/* <Text>Produit ID: {item.ProduitId}</Text> */}
              <Text>Nom: {produitList.find((p) => p.id === item.ProduitId)?.NomProduit}</Text>
              <Text>Code Entreprise Fournisseur: {item.CodeEntrepriseFournisseur}</Text>
              <Text>Date d'Importation: {item.DateImportation}</Text>
              <Text>Quantité Commandée: {item.QuantiteCommande}</Text>
              <Text>Quantité Importée: {item.QuantiteImporter}</Text>
              <View style={styles.MesIconsMdSup}>
                {/* Bouton de suppression */}
                <TouchableOpacity onPress={() => handleDeleteProduct(item.ProduitId)} style={styles.iconButton}>
                  <MaterialCommunityIcons name="delete" size={24} color="red" />
                </TouchableOpacity>

                {/* Bouton d'édition */}
                <TouchableOpacity onPress={() => handleEditProduct(item.ProduitId)} style={styles.iconButton}>
                  <MaterialCommunityIcons name="pencil" size={24} color="blue" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitCommande}
        >
          <Text style={styles.submitButtonText}>Soumettre la Commande</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
};

export default AddCommandeScreen;

