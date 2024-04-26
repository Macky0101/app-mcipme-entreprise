import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://bd-mcipme.org/bd-services/public/api';

const axiosInstance = axios.create({
  baseURL,
});

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/login', { email, password });
    // Appel de SendOtp avec l'e-mail de l'utilisateur
    // await SendOtp(email);

    // Stocker le token et les informations de l'utilisateur dans AsyncStorage
    const { access_token, user } = response.data.data; // Assurez-vous que c'est le bon chemin pour accéder au token et aux informations de l'utilisateur dans la réponse
    // console.log('Mackycamara:', access_token); // Afficher le token dans la console
    console.log('User:', user); // Afficher les informations de l'utilisateur dans la console
    // console.log('jjjjjjjjjjjjj',response.data.data)

    await AsyncStorage.setItem('@token', access_token);
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const SendOtp = async (email) => {
  try {
    const otpData = {
      email: true, // email doit être à true
      value: email, // L'adresse e-mail de l'utilisateur
    };
    const response = await axiosInstance.post('/mcipme/send-otp', otpData);
    //console.log('Code OTP envoyé:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VerifyOtp = async (email, value, code) => {
  try {
    const otpVerificationData = {
      email: true, // email doit être à true
      value: email, // value est l'e-mail de l'utilisateur
      code, // code est le code OTP envoyé
    };
    const response = await axiosInstance.post('/mcipme/verification-otp', otpVerificationData);
    //console.log('Vérification du code OTP:', response.data);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Fonction pour déconnecter l'utilisateur
export const logout = async () => {
  try {
    // Récupérer le token du stockage local
    const token = await AsyncStorage.getItem('@token');

    if (token) {
      // Ajouter le token à l'en-tête Authorization
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Supprimer le token et les informations de l'utilisateur de AsyncStorage
      await AsyncStorage.removeItem('@token');
      await AsyncStorage.removeItem('@user');
      
      // Appeler l'API pour la déconnexion
      await axiosInstance.post('/auth-user-logout');
      
      // console.log('User logged out successfully');
    } else {
      // Si le token n'est pas disponible, afficher un message d'erreur
      console.error('Token not found. User is not logged in.');
    }
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
// recuperer les infos de user
export const getUserData = async (codeMPME) => {
  try {
    // Récupérer le token du stockage local
    const token = await AsyncStorage.getItem('@token');


    // Ajouter le token à l'en-tête Authorization
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Faire une requête GET à l'API
    const response = await axiosInstance.get(`/mcipme/${codeMPME}`);

    
    console.log('User data Macky:', response.data); // Afficher les données de l'utilisateur dans la console

    return response.data;
  } catch (error) {
    throw error;
  }
};
//List types demande
export const ListTypeDemande = async () => {
  try {
    // Utilisez await pour attendre la promesse
    const response = await axiosInstance.get('/type-demandes'); 
    if (response.status === 200 && response.data) {
      // Assurez-vous que data existe et contient ce que vous attendez
      console.log('Liste des types de demande:', response.data); 
      return response.data; // Renvoie la partie "data"
    } else {
      throw new Error('La réponse de l\'API n\'est pas comme attendu.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des types de demande:', error);
    throw error;
  }
};
//demande
export const demande = async (demandeData) => {
  try {
    const response = await axiosInstance.post('/demande-autorisations', demandeData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Pour accepter les fichiers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
