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
    // console.log('Liste des commandes:', response.data);
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
    // console.log(' commandes detail:', response.data);
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
    // console('Liste des produits:', response.data);
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
    // console.log('Liste des fournisseurs:', response.data);
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
    // Récupération du code MPME
    const codeMPME = await AsyncStorage.getItem('codeMPMEs');

    
    const response = await axiosInstance.post('/commandes', {
      commandeDate: nouvelleCommande.commandeDate,
      CodeMpme: codeMPME, 
      items: nouvelleCommande.items, 
      CodeEntrepriseFournisseur: nouvelleCommande.CodeEntrepriseFournisseur,
      PaysDeProvenance: nouvelleCommande.PaysDeProvenance
    });

    //console.log('Nouvelle commande ajoutée:', response.data);
    return response.data; // Retour des données ajoutées
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la nouvelle commande:", error.message || error, );
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

    // console.log('commande validée:', response.data);
    return response.data; // Retour des données ajoutées
  } catch (error) {
    console.error("Erreur lors de la validation de la commande:", error.message || error);
    if (error.response) {
      // console.error("Détails de l'erreur:", error.response.data); // Informations supplémentaires
    }
    throw error; // Pour permettre au code appelant de gérer l'erreur
  }
};
export const ModifierCommande = async (commandeData) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // console.log("DATA",commandeData);
    const response = await axiosInstance.post('/commandes/update', commandeData);
    // console.log('Commande modifiée avec succès:', response.data);
    return response.data; // Retour des données modifiées
  } catch (error) {
    console.error('Erreur lors de la modification de la commande:', error.message || error);
    if (error.response) {
      console.error("Détails de l'erreur:", error.response.data); // Informations supplémentaires
    }
    throw error; // Pour permettre au code appelant de gérer l'erreur
  }
};


// fetchStockHistorics 


export const GetStockHistorics = async (annee = null) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const codeMPME = await AsyncStorage.getItem('codeMPMEs');
    if (!codeMPME) {
      throw new Error('Code MPME non trouvé dans le stockage');
    }

    const params = {
      code: codeMPME,
      annee: annee || new Date().getFullYear()
    };

    const response = await axiosInstance.get(`/stocks/historics`, { params });
    // console.log('Réponse de l\'API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des historiques de stocks:', error.message || error);
    if (error.response) {
      console.error("Détails de l'erreur:", error.response.data);
    }
    throw error;
  }
};
// Obtenir la liste des catégories
export const getCategories = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axiosInstance.get('/type-produits');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtenir la liste des sous-catégories
export const getSubCategories = async (categoryId) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axiosInstance.get(`/sous-produits?CategorieProduitsId=${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Obtenir la liste des produits
export const getProducts = async (subCategoryId) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axiosInstance.get(`/produits?CategorieProduit=${subCategoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
