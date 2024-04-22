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
    console.log('Liste des commandes:', response.data);
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
    console.log('Liste des commandes:', response.data);
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
    console.log('Liste des produits:', response.data);
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
    console.log('Liste des fournisseurs:', response.data);
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
    
    if (!nouvelleCommande.items || nouvelleCommande.items.length === 0) {
      throw new Error('Au moins un produit doit être inclus dans la commande.');
    }
    
    const response = await axiosInstance.post('/commandes', {
      commandeDate: nouvelleCommande.commandeDate,
      CodeMpme: "MPME-139440-2024", // Si requis
      produits: nouvelleCommande.produits, // Les produits inclus dans la commande
    });

    console.log('Nouvelle commande ajoutée:', response.data);
    return response.data; // Retour des données ajoutées
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la nouvelle commande:", error.message || error);
    if (error.response) {
      console.error("Détails de l'erreur:", error.response.data); // Informations supplémentaires
    }
    throw error; // Pour permettre au code appelant de gérer l'erreur
  }
};

