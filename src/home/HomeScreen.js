import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView ,FlatList,TextInput, Alert,Modal, Button, ActivityIndicator, Image} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';
import { ListCommand ,DeleteCommand } from './../../services/stock.Service';
import {DetailCommand, ValiderCommande } from './../../services/stock.Service'; // Assurez-vous d'importer la fonction ValiderCommande
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loadingImage from './../../assets/logo/logoD.gif';
import Toast from '../compoment/Toast';

// Récupérer les types d'entreprise depuis AsyncStorage
const getIntituleTypes = async () => {
  const intituleTypesJson = await AsyncStorage.getItem('@intituleTypes');
  return intituleTypesJson ? JSON.parse(intituleTypesJson) : [];
};

const HomeScreen = () => {
  const route = useRoute(); 
  const navigation = useNavigation(); 
  const [commands, setCommands] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [intituleTypes, setIntituleTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
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
  // Déclaration de fetchCommands
  const fetchCommands = async () => {
    setIsLoading(true); // Afficher le chargement
    try {
      const response = await ListCommand();
      setCommands(response.data); 
      hideToast();
  
    } catch (error) {
      showToast('Erreur de chargement. Vérifiez votre connexion internet.');

      console.error('Erreur lors de la récupération des commandes:', error);
   
    } finally {
      setIsLoading(false); // Masquer le chargement une fois que la requête est terminée
    }
  };
    // Récupérer les types d'entreprise à l'ouverture du composant
    useEffect(() => {
      const fetchIntituleTypes = async () => {
        try {
          const types = await getIntituleTypes();
          setIntituleTypes(types || []);
        } catch (error) {
          setIntituleTypes([]);
        }
      };
    
      fetchIntituleTypes();
    }, []);
    

    const handleAddButtonPress = () => {
      if (
        intituleTypes.includes('ENTREPRISE IMPORTATRICE') &&
        intituleTypes.includes('ENTREPRISE DISTRIBUTRICE')
      ) {
        setShowTypeModal(true);
      } else {
        const isImporter = intituleTypes.includes('ENTREPRISE IMPORTATRICE');
        navigation.navigate('AddCommandeScreen', { isImporter });
      }
    };
    

    const handleTypeChoice = (isImporter) => {
      setShowTypeModal(false);
      navigation.navigate('AddCommandeScreen', { isImporter });
    };

    

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const deleteCommand = async (id) => {
    try {
      await DeleteCommand(id);
      setCommands(commands.filter((cmd) => cmd.id !== id));
      hideToast();

    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      showToast('Erreur lors de la suppression de la commande. Vérifiez votre connexion internet.');

    }
  };

  const onLongPress = (item) => {
    if (item.CommandeValider === "1") {
      Alert.alert(
        'Information',
        'Les commandes validées ne peuvent pas être supprimées.',
        [
          { text: 'OK', style: 'cancel' }
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        'Suppression de Commande',
        `Voulez-vous vraiment supprimer la commande ${item.CodeCommande} ?`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Supprimer',
            onPress: () => deleteCommand(item.id),
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    }
  };

  useEffect(() => {
    const fetchCommands = async () => {
      setIsLoading(true); // Afficher le chargement
      try {
        const response = await ListCommand();
        setCommands(response.data);
               
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      } finally {
        setIsLoading(false); // Masquer le chargement une fois que la requête est terminée
      setRefreshing(false); // Désactiver le rafraîchissement une fois que la requête est terminée
      }
    };
    fetchCommands();

    if (route.params?.refresh) {
      setRefreshing(true); // Activer le rafraîchissement
      fetchCommands();
      setRefreshing(false); // Désactiver le rafraîchissement une fois que la requête est terminée
    }
  }, [route]); 

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.CodeCommande.toLowerCase().includes(searchText.toLowerCase()) ||
      cmd.DateCommande.toLowerCase().includes(searchText.toLowerCase()) ||
      (cmd.CommandeValider === "1" ? "Validé" : "En attente").toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCommandPress = async (id) => {
    setIsDetailLoading(true); 
    try {
      const commandDetails = await DetailCommand(id);
      navigation.navigate('DetailCommand', { commandDetails });
      hideToast();

    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la commande:', error);
      showToast('Erreur de chargement. Vérifiez votre connexion internet.');

    } finally {
      setIsDetailLoading(false); 
    }
  };

  const renderItem = ({ item }) => {
    const statut = item.CommandeValider === "1" ? "Validé" : "En attente";
    const backgroundColor = item.CommandeValider === "1" ? "lightgreen" : "lightcoral";
    return (
      <View>
        <View style={styles.separator}></View>
        <TouchableOpacity 
        style={styles.head}
        onPress={() => handleCommandPress(item.id)}
        onLongPress={() => onLongPress(item)}
        >
          <Text>{item.CodeCommande}</Text>
          <Text>{item.DateCommande}</Text>
          <View style={{ backgroundColor, padding: 4, borderRadius: 4 }}>
            <Text>{statut}</Text>
          </View>
        </TouchableOpacity>
        
      </View>
    );
  };
  

  return (
    <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionHeadingMain}>
            <Text style={styles.sectionHeadingText} numberOfLines={1}>
              Stock
            </Text>
          </View>
          <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={handleAddButtonPress}
        style={styles.addButton} 
      >
        <Text style={styles.addButtonText}>Ajout Com</Text> 
      </TouchableOpacity>
    </View>
        </View>
                <View style={styles.container}>

        <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="black" style={styles.searchIcon} />
            <TextInput
              style={styles.searchbar}
              placeholder="Rechercher une commande"
              onChangeText={handleSearch}
              value={searchText}
            />
         </View>

          <View style={styles.sectionCommand}>
            <Text style={styles.title}>La liste des commandes:</Text>

          </View>
          <View style={styles.head}>
            <Text style={styles.title}>Code</Text>
            <Text style={styles.title}>Date</Text>
            <Text style={styles.title}>Statut</Text>
          </View>
          {showTypeModal && (
          <Modal
            transparent
            animationType="fade" // Option d'animation
            visible={showTypeModal}
            onRequestClose={() => setShowTypeModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choisir une action</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleTypeChoice(true)} // Pour importer
                >
                  <Text style={styles.modalButtonText}>Importer des produits</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleTypeChoice(false)} // Pour distribuer
                >
                  <Text style={styles.modalButtonText}>Distribuer des produits</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowTypeModal(false)}
                >
                  <MaterialIcons name="close" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        </View>
        {isLoading ? (
        // {isLoading || isDetailLoading ? (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#009900" />
          // <Image source={loadingImage} style={styles.loadingImage} />
        ) : (
          <FlatList
            style={styles.container}
            data={filteredCommands}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true); // Activer le rafraîchissement
              fetchCommands();
              setRefreshing(false); // Désactiver le rafraîchissement une fois que la requête est terminée
            }}
          />
        )}
         <Toast visible={toastVisible} message={errorMessage} onDismiss={hideToast} />
    </SafeAreaView>
  );
};

export default HomeScreen;
