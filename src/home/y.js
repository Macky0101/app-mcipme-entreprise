import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, FlatList } from 'react-native';
import { ListProduits } from './../../services/stock.Service';
import {Picker} from '@react-native-picker/picker';

const AddCommandeScreen = ({ navigation }) => {
  const [commandeDate, setCommandeDate] = useState('');
  const [produits, setProduits] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState('');
  const [produitList, setProduitList] = useState([]);

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

  const handleAddProduct = () => {
    const produitToAdd = produitList.find((p) => p.id === parseInt(selectedProduit));
    if (produitToAdd) {
      setProduits([...produits, produitToAdd]);
    }
    setSelectedProduit('');
  };

  const handleSubmitCommande = () => {
    const newCommande = {
      commandeDate,
      produits,
    };
    // Envoyer la commande à l'API
    console.log('Nouvelle commande:', newCommande);
    // Navigation ou autre action après l'envoi
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ajouter une Commande</Text>
      </View>

      <View style={styles.form}>
        <Text>Date de la commande:</Text>
        <TextInput
          style={styles.input}
          value={commandeDate}
          onChangeText={setCommandeDate}
          placeholder="Entrez la date de commande"
        />

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

        <Button title="Ajouter le Produit" onPress={handleAddProduct} />

        <FlatList
          data={produits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text>Produit ID: {item.id}</Text>
              <Text>Nom: {item.NomProduit}</Text>
              <Text>Description: {item.Description}</Text>
            </View>
          )}
        />
      </View>

      <Button title="Soumettre la Commande" onPress={handleSubmitCommande} />
    </SafeAreaView>
  );
};

// export default AddCommandeScreen;

// const styles = {
//   safeAreaView: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   form: {
//     padding: 10,
//   },
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5,
//   },
//   productCard: {
//     backgroundColor: '#f9f9f9',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
// };

























// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, SafeAreaView, FlatList } from 'react-native';
// import { ListProduits, ListFournisseurs } from './../../services/stock.Service';
// import { Picker } from '@react-native-picker/picker';

// const AddCommandeScreen = ({ navigation }) => {
//   const [commandeDate, setCommandeDate] = useState('');
//   const [produits, setProduits] = useState([]);
//   const [selectedProduit, setSelectedProduit] = useState('');
//   const [produitList, setProduitList] = useState([]);
//   const [selectedFournisseur, setSelectedFournisseur] = useState('');
//   const [fournisseurList, setFournisseurList] = useState([]);

//   const [newProduit, setNewProduit] = useState({
//     ProduitId: '',
//     CodeEntrepriseFournisseur: '',
//     DateImportation: '',
//     QuantiteCommande: '',
//     QuantiteImporter: '',
//     PaysDeProvenance: '',
//   });

//   useEffect(() => {
//     const fetchProduits = async () => {
//       try {
//         const produitsData = await ListProduits();
//         setProduitList(produitsData.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des produits:', error);
//       }
//     };

//     fetchProduits();
//   }, []);

//   // Récupérer les fournisseurs
//   useEffect(() => {
//     const fetchFournisseurs = async () => {
//       try {
//         const fournisseursData = await ListFournisseurs();
//         setFournisseurList(fournisseursData.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des fournisseurs:', error);
//       }
//     };

//     fetchFournisseurs();
//   }, []);

//   const handleAddProduct = () => {
//     const produitToAdd = produitList.find((p) => p.id === parseint(selectedProduit));
//     if (produitToAdd) {
//       const newProduct = {
//         ProduitId: produitToAdd.id,
//         CodeEntrepriseFournisseur: selectedFournisseur, // CodeMpme du fournisseur
//         DateImportation: newProduit.DateImportation,
//         QuantiteCommande: newProduit.QuantiteCommande,
//         QuantiteImporter: newProduit.QuantiteImporter,
//         PaysDeProvenance: newProduit.PaysDeProvenance,
//       };

//       setProduits([...produits, newProduct]);
//       setSelectedProduit('');
//     }
//   };

//   const handleSubmitCommande = () => {
//     const newCommande = {
//       commandeDate,
//       items: produits,
//     };
//     console.log('Nouvelle commande:', newCommande);
//     // Envoyer la commande à l'API ici
//   };

//   return (
//     <SafeAreaView style={styles.safeAreaView}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Ajouter une Commande</Text>
//       </View>

//       <View style={styles.form}>
//         <Text>Date de la commande:</Text>
//         <TextInput
//           style={styles.input}
//           value={commandeDate}
//           onChangeText={(text) => setCommandeDate(text)}
//           placeholder="Entrez la date de commande"
//         />

//         <Text>Fournisseur:</Text>
//         <Picker
//           selectedValue={selectedFournisseur}
//           onValueChange={(itemValue) => setSelectedFournisseur(itemValue)}
//         >
//           <Picker.Item label="Sélectionnez un fournisseur" value="" />
//           {fournisseurList.map((fournisseur) => (
//             <Picker.Item key={fournisseur.id} label={fournisseur.pme.SigleMpme} value={fournisseur.CodeMpme} />
//           ))}
//         </Picker>

//         <Text>Ajouter des Produits:</Text>
//         <Picker
//           selectedValue={selectedProduit}
//           onValueChange={(itemValue) => setSelectedProduit(itemValue)}
//         >
//           <Picker.Item label="Sélectionnez un produit" value="" />
//           {produitList.map((produit) => (
//             <Picker.Item key={produit.id} label={produit.NomProduit} value={produit.id.toString()} />
//           ))}
//         </Picker>

//         <Text>Quantité Commandée:</Text>
//         <TextInput
//           style={styles.input}
//           value={newProduit.QuantiteCommande}
//           onChangeText={(text) => setNewProduit({ ...newProduit, QuantiteCommande: text })}
//           placeholder="Entrez la quantité commandée"
//         />

//         <Text>Date d'Importation:</Text>
//         <TextInput
//           style={styles.input}
//           value={newProduit.DateImportation}
//           onChangeText={(text) => setNewProduit({ ...newProduit, DateImportation: text })}
//           placeholder="Entrez la date d'importation"
//         />

//         <Text>Quantité Importée:</Text>
//         <TextInput
//           style={styles.input}
//           value={newProduit.QuantiteImporter}
//           onChangeText={(text) => setNewProduit({ ...newProduit, QuantiteImporter: text })}
//           placeholder="Entrez la quantité importée"
//         />

//         <Text>Pays de Provenance:</Text>
//         <TextInput
//           style={styles.input}
//           value={newProduit.PaysDeProvenance}
//           onChangeText={(text) => setNewProduit({ ...newProduit, PaysDeProvenance: text })}
//           placeholder="Entrez le pays de provenance"
//         />

//         <Button title="Ajouter le Produit" onPress={handleAddProduct} />
//       </View>

//       <FlatList
//         data={produits}
//         keyExtractor={(item) => item.ProduitId.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.productCard}>
//             <Text>Produit ID: {item.ProduitId}</Text>
//             <Text>Nom: {produitList.find(p => p.id === item.ProduitId)?.NomProduit}</Text>
//             <Text>Code Entreprise Fournisseur: {item.CodeEntrepriseFournisseur}</Text>
//             <Text>Date d'Importation: {item.DateImportation}</Text>
//             <Text>Quantité Commandée: {item.QuantiteCommande}</Text>
//             <Text>Quantité Importée: {item.QuantiteImporter}</Text>
//             <Text>Pays de Provenance: {item.PaysDeProvenance}</Text>
//           </View>
//         )}
//       />

//       <Button title="Soumettre la Commande" onPress={handleSubmitCommande} />
//     </SafeAreaView>
//   );
// };

// export default AddCommandeScreen;

// const styles = {
//   safeAreaView: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   form: {
//     padding: 10,
//   },
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5,
//   },
//   productCard: {
//     backgroundColor: '#f9f9f9',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
// };
































// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { getCategories, getSubCategories, getProducts } from './../../services/stock.Service';

// const selectProduct = () => {
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await getCategories();
//         setCategories(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des catégories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleCategorySelect = async (category) => {
//     setSelectedCategory(category);

//     try {
//       const response = await getSubCategories(category.id);
//       setSubCategories(response.data);
//       setProducts([]);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des sous-catégories:', error);
//     }
//   };

//   const handleSubCategorySelect = async (subCategory) => {
//     setSelectedSubCategory(subCategory);
//     try {
//       const response = await getProducts(subCategory.id);
//       setProducts(response.data);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des produits:', error);
//     }
//   };

//   const renderCategory = ({ item }) => (
//     <TouchableOpacity onPress={() => handleCategorySelect(item)}>
//       <Text style={styles.item}>{item.NomCategorieProduit}</Text>
//     </TouchableOpacity>
//   );

//   const renderSubCategory = ({ item }) => (
//     <TouchableOpacity onPress={() => handleSubCategorySelect(item)}>
//       <Text style={styles.item}>{item.NomCategorieProduit}</Text>
//     </TouchableOpacity>
//   );

//   const renderProduct = ({ item }) => (
//     <TouchableOpacity style={styles.productItem}>
//       <Image source={{ uri: item.ImageProduit }} style={styles.productImage} />
//       <View style={styles.productDetails}>
//         <Text style={styles.productName}>{item.NomProduit}</Text>
//         <Text style={styles.productDescription}>{item.Description}</Text>
//         <Text style={styles.productInfo}>Unité: {item.unite.Nom} ({item.unite.Symbol})</Text>
//         <Text style={styles.productInfo}>Forme: {item.forme.Nom}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sélectionnez une catégorie de produit</Text>
//       <FlatList
//         data={categories}
//         renderItem={renderCategory}
//         keyExtractor={(item) => item.id.toString()}
//         style={styles.list}
//       />
//       {subCategories && subCategories.length > 0 && (
//         <>
//           <Text style={styles.title}>Sélectionnez une sous-catégorie</Text>
//           <FlatList
//             data={subCategories}
//             renderItem={renderSubCategory}
//             keyExtractor={(item) => item.id.toString()}
//             style={styles.list}
//           />
//         </>
//       )}
//       {products && products.length > 0 && (
//         <>
//           <Text style={styles.title}>Produits</Text>
//           <FlatList
//             data={products}
//             renderItem={renderProduct}
//             keyExtractor={(item) => item.id.toString()}
//             style={styles.list}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   list: {
//     marginBottom: 16,
//   },
//   item: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   productItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     resizeMode: 'cover',
//     marginRight: 12,
//   },
//   productDetails: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   productDescription: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 8,
//   },
//   productInfo: {
//     fontSize: 14,
//     color: '#777',
//   },
// });

// export default selectProduct;








<FlatList
data={produitList}
keyExtractor={(item) => item.id.toString()}
renderItem={({ item }) => (
  <TouchableOpacity style={styles.modalItem} onPress={() => handleProduitSelect(item)}>
    <Text>{item.NomProduit}</Text>
  </TouchableOpacity>
)}
/>



















