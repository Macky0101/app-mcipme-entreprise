import React,{useState} from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ValiderCommande } from './../../services/stock.Service';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CommandDetailsScreen = ({ route,navigation }) => {
  const { commandDetails } = route.params;
  const handleStatusClick = async () => {
    if (commandDetails.data.CommandeValider === '1') {
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
             
              const response = await ValiderCommande(commandDetails.data.CodeCommande);
              console.log('reponse ',response);
              Alert.alert("Succès", "La commande a été validée.");
              // navigation.goBack(); 
              navigation.navigate('BottomTabNavigator', { screen: 'HomeScreen', params: { refresh: true } });
              // navigation.navigate('BottomTabNavigator', { refresh: true });

            } catch (error) {
              Alert.alert("Erreur", "La validation de la commande a échoué.");
            }
          },
        },
      ],
      { cancelable: true } 
    );
  };    
  return (
     <SafeAreaView style={styles.safeAreaView}>
    <View style={styles.container}>
      <View style={styles.sectionHeading}>
          <View style={styles.sectionHeadingMain}>
            <Text style={styles.sectionHeadingText} numberOfLines={1}>
            Détails de la commande
            </Text>
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity
          style={[
            styles.statusButton,
            { backgroundColor: commandDetails.data.CommandeValider === "1" ? '#90EE90' : '#F08080' }
          ]}
          onPress={handleStatusClick}
        >
          <Text style={styles.statusButtonText}>{commandDetails.data.CommandeValider === "1" ? 'Validé' : 'En attente'}</Text>
        </TouchableOpacity>
    </View>
        </View>
      

        <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Code de la commande: {commandDetails.data.CodeCommande}</Text>
        <Text style={styles.detail}>Date de la commande: {commandDetails.data.DateCommande}</Text>
        <Text style={styles.detail}>Pays de Provenance: {commandDetails.data.PaysDeProvenance || 'Locale'}</Text>
      </View>

      <Text style={styles.title}>Produits commandés:</Text>
      <FlatList
        data={commandDetails.data.produits}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Image
              source={{ uri: item.produit.ImageProduit }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.produit.NomProduit}</Text>
              <Text style={styles.productDescription}>{item.produit.Description}</Text>
              <Text>Quantité commandée: {item.QuantiteCommande}</Text>
              <Text>Quantité importée: {item.QuantiteImporter}</Text>
              <Text>Unité: {item.produit.unite.Nom} ({item.produit.unite.Symbol}) </Text>
              <Text>Unité: {item.produit.forme.Nom}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
 
 {commandDetails.data.CommandeValider !== "1" && (
    <TouchableOpacity>
<View style={{  flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 20 }}>
<TouchableOpacity onPress={() => navigation.navigate('ModifyCommandeScreen', { commandeId: commandDetails.data.id, produits: commandDetails.data.produits })}>
  <View style={styles.editButton}>
    <MaterialCommunityIcons name="pencil" size={20} color="white" />
  </View>
</TouchableOpacity>
</View>
</TouchableOpacity>
 )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 30,
    // paddingHorizontal: 24,
    marginBottom: 10
  },
  sectionHeadingMain: {
    flexShrink: 1,
  },
  sectionHeadingText: {
    fontSize: 20,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    elevation: 8,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    marginBottom: 5,
  },




  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009900',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CommandDetailsScreen;
