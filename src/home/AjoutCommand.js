
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, FlatList,ScrollView,Alert } from 'react-native';
import { ListProduits, ListFournisseurs, AjoutCommand } from './../../services/stock.Service';
import { Picker } from '@react-native-picker/picker';

const AddCommandeScreen = ({ navigation }) => {
  const [commandeDate, setCommandeDate] = useState('');
  const [produits, setProduits] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState('');
  const [produitList, setProduitList] = useState([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState('');
  const [fournisseurList, setFournisseurList] = useState([]);

  const [newProduit, setNewProduit] = useState({
    ProduitId: '',
    CodeEntrepriseFournisseur: '',
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

  // Récupérer les fournisseurs
  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const fournisseursData = await ListFournisseurs();
        setFournisseurList(fournisseursData.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des fournisseurs:', error);
      }
    };

    fetchFournisseurs();
  }, []);

  const handleAddProduct = () => {
    const produitToAdd = produitList.find((p) => p.id === parseInt(selectedProduit));
    if (produitToAdd) {
      const newProduct = {
        ProduitId: parseInt(produitToAdd.id),
        CodeEntrepriseFournisseur: selectedFournisseur,
        DateImportation: newProduit.DateImportation,
        QuantiteCommande: parseInt(newProduit.QuantiteCommande),
        QuantiteImporter: parseInt(newProduit.QuantiteImporter),
        PaysDeProvenance: newProduit.PaysDeProvenance,
      };
      

      setProduits([...produits, newProduct]);
      setSelectedProduit('');
    }
  };

  const handleSubmitCommande = async () => {
    // Préparez les données à envoyer à l'API
    const newCommande = {
      commandeDate: commandeDate, // Aligné avec le champ attendu par l'API
      produits: produits, // Les produits ajoutés
    };
  
    console.log('Nouvelle commande:', newCommande);
  
    try {
      const response = await AjoutCommand(newCommande);
      Alert.alert('Succès', 'La commande a été ajoutée avec succès.');
      navigation.navigate('HomeScreen');
    } catch (error) {
      if (error.response) {
        console.error('Détails de l\'erreur:', error.response.data);
      }
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'ajout de la commande. Veuillez réessayer.'
      );
    }
    
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView style={styles.scrollView}>
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
        <Picker
          selectedValue={selectedFournisseur}
          onValueChange={(itemValue) => setSelectedFournisseur(itemValue)}
        >
          <Picker.Item label="Sélectionnez un fournisseur" value="" />
          {fournisseurList.map((fournisseur) => (
            <Picker.Item key={fournisseur.id} label={fournisseur.pme.SigleMpme} value={fournisseur.CodeMpme} />
          ))}
        </Picker>

        <Text>Ajouter des Produits:</Text>
        <Picker
          selectedValue={selectedProduit}
          onValueChange={(itemValue) => setSelectedProduit(itemValue)}
        >
          <Picker.Item label="Sélectionnez un produit" value="" />
          {produitList.map((produit) => (
            <Picker.Item key={produit.id} label={produit.NomProduit} value={produit.id.toString()} />
          ))}
        </Picker>

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
      </View>

      <FlatList
        data={produits}
        keyExtractor={(item) => item.ProduitId.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text>Produit ID: {item.ProduitId}</Text>
            <Text>Nom: {produitList.find(p => p.id === item.ProduitId)?.NomProduit}</Text>
            <Text>Code Entreprise Fournisseur: {item.CodeEntrepriseFournisseur}</Text>
            <Text>Date d'Importation: {item.DateImportation}</Text>
            <Text>Quantité Commandée: {item.QuantiteCommande}</Text>
            <Text>Quantité Importée: {item.QuantiteImporter}</Text>
            <Text>Pays de Provenance: {item.PaysDeProvenance}</Text>
          </View>
        )}
      />

      <Button title="Soumettre la Commande" onPress={handleSubmitCommande} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCommandeScreen;

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
  productCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
};
