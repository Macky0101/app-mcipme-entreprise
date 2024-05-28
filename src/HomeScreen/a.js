import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import {ListProduits} from './../../services/stock.Service'
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from 'react-native-vector-icons';
import BarChartImportation from'./statistiqueCommand';
const Accueil = () => {
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [commandesValidees, setCommandesValidees] = useState(0);
  const [commandesEnAttente, setCommandesEnAttente] = useState(0);
  const [userNom, setUserNom] = useState('');
  const [produits, setProduits] = useState([]); // Pour stocker les trois derniers produits
  const navigation = useNavigation();


  const fetchCommandesData = async () => {
    const token = await AsyncStorage.getItem('@token');
    const response = await axios.get('https://bd-mcipme.org/bd-services/public/api/commandes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const commandes = response.data.data;

    const total = commandes.length;
    const valides = commandes.filter((commande) => parseInt(commande.CommandeValider, 10) === 1).length;
    const enAttente = commandes.filter((commande) => parseInt(commande.CommandeValider, 10) === 0).length;

    setTotalCommandes(total);
    setCommandesValidees(valides);
    setCommandesEnAttente(enAttente);
  };

  useEffect(() => {
    const fetchProduits = async () => {
        try {
          const response = await ListProduits(); // Obtenir la liste des produits
          const produitsRecents = response.data.slice(-3).reverse(); // Obtenir les trois derniers produits
          setProduits(produitsRecents); // Mettre à jour l'état avec les produits récents
        } catch (error) {
          console.error('Erreur lors de la récupération des produits:', error);
        }
      };

    const fetchUserNom = async () => {
      const storedNom = await AsyncStorage.getItem('@userNom'); 
      if (storedNom) {
        setUserNom(storedNom);
      }
    };
    fetchProduits(); // Récupérer les produits lors du montage
    fetchUserNom();
    fetchCommandesData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Appel des fonctions de récupération des données à chaque focus
      setProduits();
      setUserNom();
      fetchCommandesData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <Text style={styles.greetingText}>Bonjour</Text>
          <Text style={styles.userNameText}>{userNom}</Text>
        </View>
        <Image
          style={styles.logo}
          source={require('./../../assets/logo/logopme.png')}
          resizeMode="contain"
        />
      </View>
      <ScrollView showsHorizontalScrollIndicator={false}>

      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Animatable.View 
            animation="bounceIn" 
            style={[styles.card, { backgroundColor: '#F2F2F2' }]} 
          >
            <FontAwesome name="shopping-cart" style={styles.cardIcon} /> 
            <Text style={styles.cardTitle}>Total des Commandes</Text>
            <Text style={styles.cardValue}>{totalCommandes}</Text>
          </Animatable.View>

          <Animatable.View 
            animation="fadeInRight"
            style={[styles.card, { backgroundColor: '#F2F2F2' }]} 
          >
            <FontAwesome name="check" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Commandes Validées</Text>
            <Text style={styles.cardValue}>{commandesValidees}</Text>
          </Animatable.View>
        </View>

        <Animatable.View 
          animation="fadeInUp" 
          style={[styles.card, styles.cardLarge, { backgroundColor: '#F2F2F2' }]} 
        >
          <FontAwesome name="hourglass-half" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Commandes en Attente</Text>
          <Text style={styles.cardValue}>{commandesEnAttente}</Text>
        </Animatable.View>
      </View>
   {/* <View style={{ flexDirection:'row' , justifyContent:'space-between', padding:10}}>   
   <View>
      <Text style={{margin:10, fontSize:16, fontWeight:500}}>Lists des produits</Text>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
        // onPress={handleAddButtonPress}
        style={styles.addButton} 
      >
        <Text style={styles.addButtonText}>voir +</Text> 
      </TouchableOpacity>
    </View>
   </View> */}

      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.cardContainer}>
        {produits.map((produit, index) => (
          <Animatable.View
            key={index}
            animation="bounceIn"
            style={styles.conteneurRonde} 
          >
            <View style={styles.cardRonde}> 
              <Image
                source={{ uri: produit.ImageProduit }} 
                style={styles.cardImageRonde} 
              />
            </View>
            <Text style={styles.cardTitleProduit} >{produit.NomProduit}</Text> 
          </Animatable.View>
        ))}
      </View>
      </ScrollView> */}




<View style={styles.cardContainer}>
      <Animatable.View
        animation="zoomIn"
        style={styles.cardUnique}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('BottomTabNavigator',{screen:'HomeScreen'})}
        >
          <FontAwesome name="list-alt" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Voir les Commandes</Text>
        </TouchableOpacity>
      </Animatable.View>
      <Animatable.View
        animation="zoomIn"
        style={[styles.cardUnique1]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('BottomTabNavigator',{screen:'StockHistorics'})}
        >
          <FontAwesome name="history" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Voir Historiques</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
       



        <BarChartImportation />



      </ScrollView>
    </SafeAreaView>
    
  );
};

export default Accueil;

































// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import styles from './style';
// import axios from 'axios';
// import * as Animatable from 'react-native-animatable';
// import { ListProduits, GetStockHistorics } from './../../services/stock.Service';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { FontAwesome } from 'react-native-vector-icons';
// import BarChartImportation from './statistiqueCommand';

// const Accueil = () => {
//   const [totalCommandes, setTotalCommandes] = useState(0);
//   const [commandesValidees, setCommandesValidees] = useState(0);
//   const [commandesEnAttente, setCommandesEnAttente] = useState(0);
//   const [userNom, setUserNom] = useState('');
//   const [produits, setProduits] = useState([]);
//   const navigation = useNavigation();
//   const [stockHistorics, setStockHistorics] = useState([]);

//   const fetchCommandesData = async () => {
//     const token = await AsyncStorage.getItem('@token');
//     try {
//       const response = await axios.get('https://bd-mcipme.org/bd-services/public/api/commandes', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const commandes = response.data.data;
//       const total = commandes.length;
//       const valides = commandes.filter((commande) => parseInt(commande.CommandeValider, 10) === 1).length;
//       const enAttente = commandes.filter((commande) => parseInt(commande.CommandeValider, 10) === 0).length;

//       setTotalCommandes(total);
//       setCommandesValidees(valides);
//       setCommandesEnAttente(enAttente);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des commandes:', error);
//     }
//   };

//   const fetchProduits = async () => {
//     try {
//       const response = await ListProduits();
//       const produitsRecents = response.data.slice(-3).reverse();
//       setProduits(produitsRecents);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des produits:', error);
//     }
//   };

//   const fetchStockHistorics = async () => {
//     try {
//       const response = await GetStockHistorics();
//       if (Array.isArray(response.data)) {
//         setStockHistorics(response.data);
//       } else {
//         console.error('GetStockHistorics n\'a pas retourné un tableau:', response.data);
//       }
//     } catch (error) {
//       console.error('Erreur lors de la récupération des historiques de stock:', error);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchCommandesData();
//       fetchProduits();
//       fetchStockHistorics();
//     }, [])
//   );

//   useEffect(() => {
//     const fetchUserNom = async () => {
//       const userData = await AsyncStorage.getItem('@user');
//       if (userData) {
//         const user = JSON.parse(userData);
//         setUserNom(user.nom);
//       }
//     };

//     fetchUserNom();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Bienvenue, {userNom}!</Text>
//         </View>
//         <View style={styles.statsContainer}>
//           <View style={styles.statBox}>
//             <Text style={styles.statLabel}>Total Commandes</Text>
//             <Text style={styles.statValue}>{totalCommandes}</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statLabel}>Commandes Validées</Text>
//             <Text style={styles.statValue}>{commandesValidees}</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statLabel}>Commandes en Attente</Text>
//             <Text style={styles.statValue}>{commandesEnAttente}</Text>
//           </View>
//         </View>
//         <View style={styles.produitsContainer}>
//           <Text style={styles.sectionTitle}>Produits Récents</Text>
//           {produits.map((produit, index) => (
//             <View key={index} style={styles.produitBox}>
//               <Text style={styles.produitName}>{produit.nom}</Text>
//               <Text style={styles.produitQuantite}>Quantité: {produit.quantite}</Text>
//             </View>
//           ))}
//         </View>
//         <View style={styles.historicsContainer}>
//           <Text style={styles.sectionTitle}>Historique des Stocks</Text>
//           {stockHistorics.map((historic, index) => (
//             <View key={index} style={styles.historicBox}>
//               <Text style={styles.historicDate}>Date: {historic.DateDeMiseAJourStock}</Text>
//               <Text style={styles.historicProduit}>Produit ID: {historic.ProduitId}</Text>
//               <Text style={styles.historicQuantite}>Quantité: {historic.QuantiteReel}</Text>
//             </View>
//           ))}
//         </View>
//         <View style={styles.chartContainer}>
//           <BarChartImportation />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Accueil;
 // card: {
  //   width: '48%', // Pour avoir deux cartes côte à côte
  //   backgroundColor: '#ffffff',
  //   minWidth: '30%',
  //   borderRadius: 16,
  //   padding: 16,
  //   marginBottom: 16,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   borderLeftColor: '#FF0000',
  //   borderTopColor: '#FFD800',
  //   borderRightColor: '#55FF00',
  //   borderBottomColor: '#FFD800',
  //   borderWidth: 1,
  //   shadowOffset: {
  //     width: 0,
  //     height: 4,
  //   },
  //   shadowRadius: 6,
  //   elevation: 1,
  // },
  // cardLarge: {
  //   width: '100%', // Carte qui prend toute la largeur
  // },
  // cardIcon: {
  //   fontSize: 35, // Taille de l'icône
  //   color: '#1AB402', // Couleur de l'icône
  // },
  // cardTitle: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   color: '#555',
  //   textAlign: 'center',
  // },
  // cardValue: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#000',
  // },
  // conteneurRonde: {
  //   alignItems: 'center', // Centrer le contenu
  //   justifyContent: 'center', 
  //   margin: 8, // Espace entre les conteneurs
  // },
  // cardRonde: {
  //   width: 80, // Taille de la carte ronde
  //   height: 80, // Taille de la carte ronde
  //   backgroundColor: '#ffffff',
  //   borderRadius: 40, // Pour la forme ronde
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 4,
  //   },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 6,
  //   elevation: 8,
  //   overflow: 'hidden', // Empêcher le débordement
  // },
  // cardImageRonde: {
  //   width: '100%', // L'image doit remplir la carte
  //   height: '100%', // L'image doit remplir la carte
  //   resizeMode: 'cover', // Pour que l'image remplisse la carte
  // },
  // cardTitleProduit: {
  //   fontSize: 14, // Taille de la police
  //   color: '#333', // Couleur du texte
  //   textAlign: 'center', // Centrer le texte
  //   paddingTop: 8, // Espace entre le texte et l'image
  // },
  // cardUnique: {
  //   width: '45%', // Pour avoir deux cartes côte à côte
  //   backgroundColor: 'rgba(255, 255, 255, 0.4)', // Couleur unique
  //   padding: 16, // Espace interne
  //   margin: 8,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 8,
  //   },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 10,
  //   elevation: 5,
  //   borderColor: 'rgba(0, 0, 0, 0.1)',
  //   // Utilisation de borderRadius pour créer des formes uniques
  //   borderTopLeftRadius: 100, 
  //   borderBottomRightRadius: 90,
  //   borderBottomEndRadius: 60,
  //   borderBottomLeftRadius: 60,
  // },
  // cardUnique1: {
  //   width: '45%', // Pour avoir deux cartes côte à côte
  //   backgroundColor: 'rgba(255, 255, 255, 0.4)', // Couleur unique
  //   padding: 16, // Espace interne
  //   margin: 8,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 8,
  //   },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 10,
  //   elevation: 5,

  //   // Utilisation de borderRadius pour créer des formes uniques
  //   borderTopRightRadius: 100,
  //   borderBottomLeftRadius: 50,
  //   borderTopLeftRadius: 10,
  //   borderBottomRightRadius: 60,
  // },