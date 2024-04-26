import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://bd-mcipme.org/bd-services/public/api';

const axiosInstance = axios.create({
  baseURL,
});

export const ListCommand = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await axiosInstance.get(`/commandes`);
    // //console('Liste des commandes:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// detail commandes
export const DetailCommand = async (id) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await axiosInstance.get(`/commandes/${id}`);
    // //console('Liste des commandes:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCommand = async (id) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axiosInstance.delete(`/commandes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    throw error;
  }
};

// // Configurer l'autorisation avec le token
// const configureAuthHeader = async () => {
//   const token = await AsyncStorage.getItem('@token');
//   axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// };

//list des produits
export const ListProduits = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await axiosInstance.get(`/produits`);
    //console('Liste des produits:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// list des fournisseurs

export const ListFournisseurs = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await axiosInstance.get(`/liste-entreprise-importatrices-exportatrices`);
    //console('Liste des fournisseurs:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Ajouter une nouvelle commande
export const AjoutCommand = async (nouvelleCommande) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Validation des champs requis
    if (!nouvelleCommande.commandeDate) {
      throw new Error('La date de commande est requise.');
    }
    const codeMPME = await AsyncStorage.getItem('code_Mpme'); 

    const response = await axiosInstance.post('/commandes', {
      commandeDate: nouvelleCommande.commandeDate,
      CodeMpme: codeMPME, 
      items: nouvelleCommande.items, 
      CodeEntrepriseFournisseur: nouvelleCommande.CodeEntrepriseFournisseur,
      PaysDeProvenance: nouvelleCommande.PaysDeProvenance
    });

    //console('Nouvelle commande ajoutée:', response.data);
    return response.data; // Retour des données ajoutées
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la nouvelle commande:", error.message || error);
    if (error.response) {
      console.error("Détails de l'erreur:", error.response.data); // Informations supplémentaires
    }
    throw error; // Pour permettre au code appelant de gérer l'erreur
  }
};

export const ValiderCommande = async (code) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axiosInstance.post('/commandes/pme/validation', {code});

    console('commande validée:', response.data);
    return response.data; // Retour des données ajoutées
  } catch (error) {
    console.error("Erreur lors de la validation de la commande:", error.message || error);
    if (error.response) {
      console.error("Détails de l'erreur:", error.response.data); // Informations supplémentaires
    }
    throw error; // Pour permettre au code appelant de gérer l'erreur
  }
};
