
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, Button, SafeAreaView, TouchableOpacity, Modal, FlatList, Alert, Image,
  ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ListProduits, ModifierCommande, getCategories, getSubCategories, getProducts } from './../../services/stock.Service';
import styles from './stylesAjoutcommand';

const ModifyCommandeScreen = ({ route, navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);
  // const [selectedProduit, setSelectedProduit] = useState(null);



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

  // const renderProductItem = useCallback(({ item }) => (
  //   <TouchableOpacity onPress={() => {}} style={styles.productItem}>
  //     <View style={styles.productInfo}>
  //       <Text style={styles.productText}>{item.NomProduit}</Text>
  //       <Text style={styles.productUnit}>{item.unite.Nom} ({item.unite.Symbol})</Text>
  //     </View>
  //     <Image
  //       source={{ uri: item.ImageProduit }}
  //       style={styles.productImage}
  //       resizeMode="cover"
  //     />
  //   </TouchableOpacity>
  // ), []);
  const renderProductItem = useCallback(({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedProduit(item)}
      style={[
        styles.productItem,
        selectedProduit && selectedProduit.id === item.id && { backgroundColor: '#ccc' }, // Style pour l'élément sélectionné
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
  ), [selectedProduit]);


  let filteredChildren = [];
  if (selectedCategory && selectedCategory.children) {
    filteredChildren = selectedCategory.children.filter(child => {
      return child.CategorieProduitsId === selectedCategory.id.toString(); // Filtrer selon l'ID de la catégorie principale
    });
  }













  const { commandeId, produits } = route.params || {};
  const [commandeDate, setCommandeDate] = useState(new Date());
  const [items, setProduits] = useState(produits);
  const [produitList, setProduitList] = useState([]);
  // const [selectedProduit, setSelectedProduit] = useState(null);

  const [newProduit, setNewProduit] = useState({
    ProduitId: '',
    DateImportation: new Date(),
    QuantiteCommande: '',
    QuantiteImporter: '',
    // PaysDeProvenance: '',
  });
  const [isProduitModalVisible, setProduitModalVisible] = useState(false);
  const [isCommandeDatePickerVisible, setCommandeDatePickerVisible] = useState(false);
  const [isDateImportationPickerVisible, setDateImportationPickerVisible] = useState(false);

  useEffect(() => {
    const firstCommandeDate = produits.length > 0 ? new Date(produits[0].DateImportation) : new Date();
    setCommandeDate(firstCommandeDate);
  }, [produits]);

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

  const openProduitModal = () => {
    setProduitModalVisible(true);
  };

  const closeProduitModal = () => {
    setProduitModalVisible(false);
  };


  const handleProduitSelect = (produit) => {
    setSelectedProduit(produit); // Met à jour le produit sélectionné
    setNewProduit({
      ProduitId: produit.id.toString(),
      DateImportation: new Date(), // Vous pouvez définir une date par défaut ici
      QuantiteCommande: '',
      QuantiteImporter: '',
      // PaysDeProvenance: '',
    });
    closeProduitModal(); // Ferme le modal de sélection de produit
  };


  const handleDateChange = (event, selectedDate, field) => {
    if (field === 'commande') {
      setCommandeDatePickerVisible(false);
      if (selectedDate) {
        setCommandeDate(selectedDate);
      }
    } else if (field === 'importation') {
      setDateImportationPickerVisible(false);
      if (selectedDate) {
        setNewProduit({ ...newProduit, DateImportation: selectedDate });
      }
    }
  };
  

  const handleEditProduct = (productId) => {
    const productToEdit = items.find((item) => item.id === productId);
    if (productToEdit) {
      setSelectedProduit(productToEdit);
      setNewProduit({
        ProduitId: productToEdit.ProduitId,
        DateImportation: new Date(productToEdit.DateImportation),
        QuantiteCommande: productToEdit.QuantiteCommande.toString(),
        QuantiteImporter: productToEdit.QuantiteImporter.toString(),
        // PaysDeProvenance: productToEdit.PaysDeProvenance,
      });
    }
  };

  // const handleDeleteProduct = (productId) => {
  //   const updatedProducts = items.filter((item) => item.id !== productId);
  //   setProduits(updatedProducts);
  // };

  const handleModifyProduct = () => {
    if (!selectedProduit) {
      Alert.alert('Erreur', 'Veuillez sélectionner un produit.');
      return;
    }
  
    const newProductId = selectedProduit.id.toString();
    if (!newProductId) {
      Alert.alert('Erreur', 'L\'ID du produit sélectionné est invalide.');
      return;
    }
  
    const existingProductIndex = items.findIndex((item) => item.id === selectedProduit.id);
  
    if (existingProductIndex !== -1) {
      const updatedProducts = [...items];
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        DateImportation: newProduit.DateImportation.toISOString().split('T')[0],
        QuantiteCommande: newProduit.QuantiteCommande,
        QuantiteImporter: newProduit.QuantiteImporter,
        // PaysDeProvenance: newProduit.PaysDeProvenance,
      };
      setProduits(updatedProducts);
      // console.log("DATA COMMANDE",updatedProducts);
    } else {
      setProduits([
        ...items,
        {
          id: "",
          ProduitId: newProductId,
          DateImportation: newProduit.DateImportation.toISOString().split('T')[0],
          QuantiteCommande: newProduit.QuantiteCommande,
          QuantiteImporter: newProduit.QuantiteImporter,
          // PaysDeProvenance: newProduit.PaysDeProvenance,
        }
      ]);
    }
  
    setNewProduit({
      ProduitId: '',
      DateImportation: new Date(),
      QuantiteCommande: '',
      QuantiteImporter: '',
      // PaysDeProvenance: '',
    });
    setSelectedProduit(null);
    closeProduitModal();
  };
  

  const handleSubmitCommande = async () => {
    const commandeData = {
      commande: commandeId,
      PaysDeProvenance: items[0].PaysDeProvenance,
      CodeEntrepriseFournisseur: items[0].CodeEntrepriseFournisseur,
      items: items.map((item) => {
        if(item.id !==""){
          return {
            id: item.id,
            ProduitId: item.ProduitId,
            DateImportation: item.DateImportation,
            QuantiteCommande: item.QuantiteCommande,
            QuantiteImporter: item.QuantiteImporter,
          }
        }else{
          return {
            ProduitId: item.ProduitId,
            DateImportation: item.DateImportation,
            QuantiteCommande: item.QuantiteCommande,
            QuantiteImporter: item.QuantiteImporter,
          }
        }
      }),
    };
  
    try {
      await ModifierCommande(commandeData);
      Alert.alert('Succès', 'La commande a été modifiée avec succès.');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la modification de la commande:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification de la commande.');
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
       {/* <Text>ID du produit sélectionné : {selectedProduit ? selectedProduit.id : 'Aucun produit sélectionné'}</Text> */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Modifier la Commande</Text>
        </View>
        <View>
          <TouchableOpacity
            style={{ backgroundColor: '#009900', padding: 10, borderRadius: 5, alignItems: 'center' }}
            onPress={handleModifyProduct}
          >
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Modifier</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ padding: 5 }}>
        <Text>Date de la commande:</Text>
        <TouchableOpacity
          onPress={() => setCommandeDatePickerVisible(true)}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 5 }}
        >
          <Text>{commandeDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {isCommandeDatePickerVisible && (
          <DateTimePicker
            value={commandeDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'commande')}
          />
        )}
      </View>

      <Text>Produit :</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={openProduitModal}
      >
        <Text>{selectedProduit ? selectedProduit.NomProduit : 'Sélectionnez un produit'}</Text>
      </TouchableOpacity>
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





      {/* <View style={{ padding: 5 }}>
        <Text>Produit:</Text>
        <TouchableOpacity onPress={openProduitModal}>
          <Text>{selectedProduit?.NomProduit || 'Sélectionnez un produit'}</Text>
        </TouchableOpacity>
      </View> */}
      <View style={{ padding: 5 }}>
        <Text>Date d'importation:</Text>
        <TouchableOpacity
          onPress={() => setDateImportationPickerVisible(true)}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 5 }}
        >
          <Text>{newProduit.DateImportation.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {isDateImportationPickerVisible && (
          <DateTimePicker
            value={newProduit.DateImportation}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'importation')}
          />
        )}
      </View>
      <View style={{ padding: 5 }}>
        <Text>Quantité commandée:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 5 }}
          value={newProduit.QuantiteCommande}
          onChangeText={(text) => setNewProduit({ ...newProduit, QuantiteCommande: text })}
          keyboardType="numeric"
        />
      </View>
      <View style={{ padding: 5 }}>
        <Text>Quantité importée:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 5 }}
          value={newProduit.QuantiteImporter}
          onChangeText={(text) => setNewProduit({ ...newProduit, QuantiteImporter: text })}
          keyboardType="numeric"
        />
      </View>
      {/* <View style={{ padding: 5 }}>
        <Text>Pays de provenance:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 5 }}
          value={newProduit.PaysDeProvenance}
          onChangeText={(text) => setNewProduit({ ...newProduit, PaysDeProvenance: text })}
        />
      </View> */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>Produit: {item.ProduitId}</Text>
            <Text>Date d'importation: {item.DateImportation}</Text>
            <Text>Quantité commandée: {item.QuantiteCommande}</Text>
            <Text>Quantité importée: {item.QuantiteImporter}</Text>
            {/* <Text>Pays de provenance: {item.PaysDeProvenance}</Text> */}
            {/* <Button title="Modifier" onPress={() => handleEditProduct(item.id)} />
            <Button title="Supprimer" onPress={() => handleDeleteProduct(item.id)} /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              {/* <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={{ marginRight: 20 }}>
                <MaterialCommunityIcons name="delete" size={24} color="red" />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => handleEditProduct(item.id)}>
                <MaterialCommunityIcons name="pencil" size={24} color="blue" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={{ backgroundColor: '#009900', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 20 }}
        onPress={handleSubmitCommande}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Soumettre la commande</Text>
      </TouchableOpacity>
      <Modal visible={isProduitModalVisible} onRequestClose={closeProduitModal}>
        <View style={{ padding: 20 }}>
          <FlatList
            data={produitList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleProduitSelect(item)}>
                <Text>{item.NomProduit}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Fermer" onPress={closeProduitModal} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ModifyCommandeScreen;
