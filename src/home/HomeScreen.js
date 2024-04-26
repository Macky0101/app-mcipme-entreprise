import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView ,FlatList,TextInput, Alert} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';
import { ListCommand ,DeleteCommand } from './../../services/stock.Service';
import {DetailCommand} from './../../services/stock.Service';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const route = useRoute(); 
  const navigation = useNavigation(); 
  const [commands, setCommands] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [commandesValidees, setCommandesValidees] = useState(0);
  const [commandesEnAttente, setCommandesEnAttente] = useState(0);
  const [commandesAnnulees, setCommandesAnnulees] = useState(0);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const deleteCommand = async (id) => {
    try {
      await DeleteCommand(id);
      setCommands(commands.filter((cmd) => cmd.id !== id));
    } catch (error) {
      //console.error('Erreur lors de la suppression de la commande:', error);
    }
  };
  const onLongPress = (item) => {
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
  };

  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const response = await ListCommand();
        //console.log('Liste des commandes :', response.data);
        setCommands(response.data);
                // Calculer le total des commandes
                const total = response.data.length;
                setTotalCommandes(total);
        
                // Calculer le total des commandes validées
                const validees = response.data.filter((cmd) => cmd.CommandeValider === "1").length;
                setCommandesValidees(validees);
        
                // Commandes en attente
                const enAttente = response.data.filter((cmd) => cmd.CommandeValider === "0").length;
                setCommandesEnAttente(enAttente);
        
                // Commandes annulées (vous devrez peut-être adapter cette logique à votre code)
                const annulees = response.data.filter((cmd) => cmd.CommandeAnnule === "1").length;
                setCommandesAnnulees(annulees);
      } catch (error) {
        //console.error('Erreur lors de la récupération des commandes:', error);
      }
    };
    fetchCommands(); // Chargement initial des commandes

    if (route.params?.refresh) { // Utilisez `route.params` au lieu de `getParam`
      fetchCommands(); // Recharger les commandes si le paramètre "refresh" est vrai
    }
  }, [route]); 

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.CodeCommande.toLowerCase().includes(searchText.toLowerCase()) ||
      cmd.DateCommande.toLowerCase().includes(searchText.toLowerCase()) ||
      (cmd.CommandeValider === "1" ? "Validé" : "En attente").toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const statut = item.CommandeValider === "1" ? "Validé" : "En attente";
    const backgroundColor = item.CommandeValider === "1" ? "lightgreen" : "lightcoral";
    return (
      <View>
        <View style={styles.separator}></View>
        <TouchableOpacity 
        style={styles.head}
        onPress={() => {
          navigation.navigate("DetailCommande", { commande: item });  // Passer les données lors de la navigation
        }}
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
        </View>
                <View style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

          <View style={styles.row}>
            <TouchableOpacity style={styles.card}>
              <View style={styles.head}>
                <MaterialIcons name="shopping-cart" size={24} color="black" style={{ paddingTop: 5,  marginRight: 5,  backgroundColor: '#ccefff', padding: 5, borderRadius:5 }} />
                <Text style={styles.total}>{totalCommandes}</Text>
              </View>
              <Text>Commandes totales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card2}>
              <View style={styles.head}>
                <MaterialIcons name="shopping-cart" size={24} color="black" style={{ paddingTop: 5, marginRight: 5, backgroundColor: '#fff9cc', padding: 5, borderRadius:5 }} />
                <Text style={styles.total}>{commandesEnAttente}</Text>
              </View>
              <Text>Commandes en attente</Text>
            </TouchableOpacity>
          
          {/* <View style={styles.row}> */}
            <TouchableOpacity style={styles.card3}>
              <View style={styles.head}>
                <MaterialIcons name="shopping-cart" size={24} color="black" style={{ paddingTop: 5, marginRight: 5, backgroundColor:'#ccffcc', padding: 5, borderRadius:5 }} />
                <Text style={styles.total}>{commandesValidees}</Text>
              </View>
              <Text>Commandes validées</Text>
            </TouchableOpacity>
            {/* </View> */}
            {/* <TouchableOpacity style={styles.card4}>
              <View style={styles.head}>
                <MaterialIcons name="shopping-cart" size={24} color="black" style={{ paddingTop: 5, marginRight: 5, backgroundColor:'#ffcccc', padding: 5, borderRadius:5 }} />
                <Text style={styles.total}>{commandesAnnulees}</Text>
              </View>
              <Text>Commandes annulées</Text>
            </TouchableOpacity> */}
          </View>
         
          
        
        </ScrollView>
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
            <TouchableOpacity
            onPress={() => navigation.navigate("AddCommandeScreen")}
          >
          <MaterialIcons name="add" size={28} color="black" style={{ color: 'blue' }} />
        </TouchableOpacity>
          </View>
          <View style={styles.head}>
            <Text style={styles.title}>Code</Text>
            <Text style={styles.title}>Date</Text>
            <Text style={styles.title}>Statut</Text>
          </View>
        </View>
        
      <FlatList
      style={styles.container}
            data={filteredCommands}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
    </SafeAreaView>
  );
};

export default HomeScreen;


