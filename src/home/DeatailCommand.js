import React from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from 'react-native-vector-icons';
import { ValiderCommande } from './../../services/stock.Service';

const AddCommandeScreen = ({ navigation }) => {
  const route = useRoute();
  const { commande } = route.params;

  const getStatusBackgroundColor = (status) => (status === '1' ? 'lightgreen' : 'lightcoral');

  const handleStatusClick = async () => {
    if (commande.CommandeValider === '1') {
      Alert.alert("Information", "Cette commande est déjà validée.");
      return;
    }

    Alert.alert(
      "Validation de la commande",
      "Voulez-vous vraiment valider cette commande ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Valider",
          onPress: async () => {
            try {
              const response = await ValiderCommande(commande.code);
              console.log('macky',response);
              Alert.alert("Succès", "La commande a été validée.");
              navigation.goBack(); // Retour à l'écran précédent ou rafraîchissement
            } catch (error) {
              Alert.alert("Erreur", "La validation de la commande a échoué.");
            }
          },
        },
      ],
      { cancelable: true } // Permet de fermer l'alerte en cliquant en dehors
    );
  };

  const renderProduit = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <MaterialIcons name="calendar-today" size={20} color="#666" />
        <Text>Date d'Importation: {item.DateImportation || 'Non disponible'}</Text>
      </View>
      <View style={styles.cardRow}>
        <MaterialIcons name="shopping-cart" size={20} color="#666" />
        <Text>Quantité Commandée: {item.QuantiteCommande || 'Non disponible'}</Text>
      </View>
      <View style={styles.cardRow}>
        <MaterialIcons name="inventory" size={20} color="#666" />
        <Text>Quantité Importée: {item.QuantiteImporter || 'Non disponible'}</Text>
      </View>
      <View style={styles.cardRow}>
        <MaterialIcons name="warehouse" size={20} color="#666" />
        <Text>Entrée en Stock: {item.DateEntreeStock || 'Non disponible'}</Text>
      </View>
      <View style={styles.cardRow}>
        <MaterialIcons name="public" size={20} color="#666" />
        <Text>Pays de Provenance: {item.PaysDeProvenance || 'Non disponible'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Détails de la Commande</Text>
      </View>

      <View style={styles.commandDetails}>
        <View>
          <Text style={{ paddingBottom: 5 }}>Code: {commande.CodeCommande}</Text>
          <Text>Date: {commande.DateCommande}</Text>
        </View>
        <TouchableOpacity onPress={handleStatusClick}>
          <Text
            style={{
              backgroundColor: getStatusBackgroundColor(commande.CommandeValider),
              padding: 5,
              borderRadius: 5,
            }}
          >
            Statut: {commande.CommandeValider === '1' ? 'Validée' : 'En attente'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Produits</Text>

      <FlatList
        data={commande.produits}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProduit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  commandDetails: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AddCommandeScreen;
