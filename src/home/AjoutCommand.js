import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  FlatList,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { ListProduits, ListFournisseurs, AjoutCommand } from './../../services/stock.Service';

const AddCommandeScreen = ({ navigation }) => {
  const [commandeDate, setCommandeDate] = useState('');
  const [items, setProduits] = useState([]);
  const [produitList, setProduitList] = useState([]);
  const [fournisseurList, setFournisseurList] = useState([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);

  const [isFournisseurModalVisible, setFournisseurModalVisible] = useState(false);
  const [isProduitModalVisible, setProduitModalVisible] = useState(false);

  const [newProduit, setNewProduit] = useState({
    ProduitId: '',
    DateImportation: '',
    QuantiteCommande: '',
    QuantiteImporter: '',
    PaysDeProvenance: '',
  });

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

  const handleProduitSelect = (produit) => {
    setSelectedProduit(produit);
    closeProduitModal();
  };

  const handleAddProduct = () => {
    if (!selectedProduit) {
      Alert.alert('Erreur', 'Veuillez sélectionner un produit.');
      return;
    }

    const { DateImportation, QuantiteCommande, QuantiteImporter } = newProduit;
    if (!DateImportation || !QuantiteCommande || !QuantiteImporter) {
      Alert.alert('Erreur', 'Les champs requis ne sont pas remplis.');
      return;
    }

    const produitToAdd = produitList.find((p) => p.id === parseInt(selectedProduit.id));
    if (!produitToAdd) {
      Alert.alert('Erreur', 'Produit non trouvé.');
      return;
    }

    const newProduct = {
      ProduitId: produitToAdd.id,
      DateImportation: DateImportation,
      QuantiteCommande: parseInt(QuantiteCommande),
      QuantiteImporter: parseInt(QuantiteImporter),
      CodeEntrepriseFournisseur: selectedFournisseur.CodeMpme,
      PaysDeProvenance: newProduit.PaysDeProvenance,
    };

    setProduits((prevProduits) => [...prevProduits, newProduct]);
    setNewProduit({
      ProduitId: '',
      DateImportation: '',
      QuantiteCommande: '',
      QuantiteImporter: '',
      PaysDeProvenance: '',
    });
    setSelectedProduit(null);
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
      commandeDate,
      CodeMpme: selectedFournisseur?.CodeMpme || null,
      items,
    };

    try {
      const response = await AjoutCommand(newCommande);
      Alert.alert('Succès', 'La commande a été ajoutée avec succès.');
      navigation.navigate('HomeScreen', { refresh: true });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la commande:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'ajout de la commande.');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* <ScrollView style={styles.scrollView}> */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Ajouter une Commande</Text>
        </View>

        <View style={styles.form}>
          <Text>Date de la commande:</Text>
          <TextInput
            style={styles.input}
            value={commandeDate}
            onChangeText={(text) => setCommandeDate(text)}
            placeholder="Entrez la date de commande"
          />

          <Text>Fournisseur:</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={openFournisseurModal}
          >
            <Text>{selectedFournisseur?.pme?.SigleMpme || 'Sélectionnez un fournisseur'}</Text>
          </TouchableOpacity>

          <Text>Produit:</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={openProduitModal}
          >
            <Text>{selectedProduit?.NomProduit || 'Sélectionnez un produit'}</Text>
          </TouchableOpacity>

          <Text>Quantité Commandée:</Text>
          <TextInput
            style={styles.input}
            value={newProduit.QuantiteCommande}
            onChangeText={(text) => setNewProduit({ ...newProduit, QuantiteCommande: text })}
            placeholder="Entrez la quantité commandée"
          />

          <Text>Date d'Importation:</Text>
          <TextInput
            style={styles.input}
            value={newProduit.DateImportation}
            onChangeText={(text) => setNewProduit({ ...newProduit, DateImportation: text })}
            placeholder="Entrez la date d'importation"
          />

          <Text>Quantité Importée:</Text>
          <TextInput
            style={styles.input}
            value={newProduit.QuantiteImporter}
            onChangeText={(text) => setNewProduit({ ...newProduit, QuantiteImporter: text })}
            placeholder="Entrez la quantité importée"
          />
          
          <Text>Pays de Provenance:</Text>
          <TextInput
            style={styles.input}
            value={newProduit.PaysDeProvenance}
            onChangeText={(text) => setNewProduit({ ...newProduit, PaysDeProvenance: text })}
            placeholder="Entrez le pays de provenance"
          />

          <Button title="Ajouter le Produit" onPress={handleAddProduct} />

          {/* Fournisseur Modal */}
          <Modal
            transparent
            visible={isFournisseurModalVisible}
            animationType="slide"
            onRequestClose={closeFournisseurModal}
          >
            <View style={styles.modalContainer}>
              <FlatList
                data={fournisseurList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleFournisseurSelect(item)}
                  >
                    <Text>{item.pme?.SigleMpme}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="Fermer" onPress={closeFournisseurModal} />
            </View>
          </Modal>

          {/* Produit Modal */}
          <Modal
            transparent
            visible={isProduitModalVisible}
            animationType="slide"
            onRequestClose={closeProduitModal}
          >
            <View style={styles.modalContainer}>
              <FlatList
                data={produitList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleProduitSelect(item)}
                  >
                    <Text>{item.NomProduit}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="Fermer" onPress={closeProduitModal} />
            </View>
          </Modal>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.ProduitId.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text>Produit ID: {item.ProduitId}</Text>
              <Text>Nom: {produitList.find((p) => p.id === item.ProduitId)?.NomProduit}</Text>
              <Text>Code Entreprise Fournisseur: {item.CodeEntrepriseFournisseur}</Text>
              <Text>Date d'Importation: {item.DateImportation}</Text>
              <Text>Quantité Commandée: {item.QuantiteCommande}</Text>
              <Text>Quantité Importée: {item.QuantiteImporter}</Text>
              <Text>Pays de Provenance: {item.PaysDeProvenance}</Text>
            </View>
          )}
        />

        <Button title="Soumettre la Commande" onPress={handleSubmitCommande} />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = {
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
};

export default AddCommandeScreen;
