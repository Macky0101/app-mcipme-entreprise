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
    // console.log('Entreprises:', user.Entreprises); // Afficher les informations de l'utilisateur dans la console
    // console.log('jjjjjjjjjjjjj',response.data.data)

    // Stocker le code MPME avec une clé unique
    const codeMPME = user.Entreprises; // Assurez-vous que ce chemin est correct
    await AsyncStorage.setItem('codeMPMEs', codeMPME);
    // console.log('Code MPME stocké dans AsyncStorage:', codeMPME);
    const Nom = user.Nom;
    await AsyncStorage.setItem('@userNom', Nom);

    await AsyncStorage.setItem('@token', access_token);
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    await AsyncStorage.setItem('@userEmail', email);
    // console.log('email stocké dans AsyncStorage:',email);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reconnectWithPin = async (pin) => {
  try {
    // Récupérer l'email stocké
    const email = await AsyncStorage.getItem('@userEmail');

    if (!email) {
      throw new Error("Email not found. User must reconnect with email and password.");
    }

    // Effectuer la connexion avec l'email stocké et le code PIN comme mot de passe
    const response = await axiosInstance.post('/login', { email, password: pin });

    const { access_token } = response.data.data;
    await AsyncStorage.setItem('@token', access_token);

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
    const email = await AsyncStorage.getItem('@userEmail');

    // console.log('Déconnexion en cours :');
    // console.log('Token avant déconnexion:', token);
    // console.log('Email avant déconnexion:', email);

    if (token) {
      // Ajouter le token à l'en-tête Authorization
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Supprimer le token et les informations de l'utilisateur de AsyncStorage
      await AsyncStorage.removeItem('@token');
      // await AsyncStorage.removeItem('@user');

      // console.log('Token supprimé.'); // Confirmer la suppression du token
      // console.log('Email toujours stocké:', email); // Confirmer que l'email est toujours là


      
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

    
    // console.log('User data Macky:', response.data); // Afficher les données de l'utilisateur dans la console

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
      // console.log('Liste des types de demande:', response.data); 
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

// Fonction de changement de mot de passe
export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  try {
    // Récupérer le token d'authentification
    const token = await AsyncStorage.getItem('@token');

    if (!token) {
      throw new Error('Token d\'authentification non trouvé.');
    }

    // Configurer l'en-tête Authorization avec le token
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Appeler l'API pour changer le mot de passe
    const response = await axiosInstance.post('/auth-change-password', {
      old_password: oldPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw error; // Lancer l'erreur pour la gestion côté application
  }
};