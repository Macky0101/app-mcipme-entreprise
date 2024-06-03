import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal, FlatList, Button, Alert, ActivityIndicator,KeyboardAvoidingView,Platform,TouchableWithoutFeedback, Keyboard} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';
import { ListTypeDemande, demande } from './../../services/apiService'; // Assurez-vous d'importer les fonctions correctes
import { useNavigation } from '@react-navigation/native';
import Toast from '../compoment/Toast';

const DemandeOtorisation = () => {
  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresseEmail, setAdresseEmail] = useState('');
  const [numeroPhone, setNumeroPhone] = useState('');
  const [numeroBiometrique, setNumeroBiometrique] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({
    fileCarteBiometric: null,
    certificat: null,
    LettreManuscrite: null,
    documentRCCM: null,
  });
  const [typesDemande, setTypesDemande] = useState([]);
  const [selectedTypeDemande, setSelectedTypeDemande] = useState(null);
  const [isTypeDemandeModalVisible, setIsTypeDemandeModalVisible] = useState(false);
  const [choix, setChoix] = useState('OUI');
  const [isChoixModalVisible, setIsChoixModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  useEffect(() => {
    const fetchTypesDemande = async () => {
      try {
        const response = await ListTypeDemande();
        if (response.status === 'success' && response.data) {
          // console.log('Types de demande chargés:', response.data); 
          setTypesDemande(response.data);
        } else {
          //console.error('Structure inattendue de la réponse:', response);
        }
      } catch (error) {
        //console.error('Erreur lors du chargement des types de demande:', error);
      }
    };

    fetchTypesDemande(); // Charger les types de demande
  }, []);

  const selectDocument = async (docType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
          'application/vnd.ms-excel', 
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint', 
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ],
        multiple: false,
      });

      if (result.type !== 'cancel') {
        setSelectedFiles((prevFiles) => ({
          ...prevFiles,
          [docType]: result,
        }));
      }
    } catch (err) {
      //console.error("Erreur lors de la sélection de fichiers:", err);
    }
  };

  const handleEnvoyer = async () => {
    setIsLoading(true); 
    try {
     
      // console.log(selectedFiles.fileCarteBiometric); 
      const formData = new FormData();

      // Ajouter les champs textuels
      formData.append("Nom", nom);
      formData.append("Prenoms", prenom);
      formData.append("Email", adresseEmail);
      formData.append("Telephone", numeroPhone);
      formData.append("ProduitAlimentaire", choix);
      if (selectedTypeDemande) {
        formData.append("TypeDemandeId", selectedTypeDemande.id); 
    } else {
        console.error("Erreur: TypeDemandeId est manquant.");
        setIsLoading(false);
        Alert.alert('Erreur', 'Vous devez sélectionner un type de demande.');
        return; // Arrêter si TypeDemandeId est manquant
    }
      // Ajouter les fichiers
      if (selectedFiles.LettreManuscrite) {
        const file = selectedFiles.LettreManuscrite;
        formData.append("Lettre" ,selectedFiles.LettreManuscrite.assets[0]);
      } else {
        formData.append("Lettre", null); // Ajoutez null si le champ doit être requis
      }

      if (selectedFiles.certificat) {
        const file = selectedFiles.certificat;
        formData.append("Certifica", selectedFiles.certificat.assets[0] );
      } else {
        formData.append("Certifica", null);
      }

      if (selectedFiles.documentRCCM) {
        const file = selectedFiles.documentRCCM;
        formData.append("FileRcm", selectedFiles.documentRCCM.assets[0]);
      } else {
        formData.append("FileRcm", null);
      }

      if (selectedFiles.fileCarteBiometric) {
        const file = selectedFiles.fileCarteBiometric;
        formData.append("FileCarteBiometric", selectedFiles.fileCarteBiometric.assets[0]);
      } else {
        formData.append("FileCarteBiometric", null);
      }
      // Envoyer la requête
      const response = await demande(formData);
      console.log('response', response);
      setIsLoading(false);
      if (response.status === 'success') {
        Alert.alert('Demande envoyée', 'Votre demande a été envoyée avec succès!');
        navigation.goBack(); 
      } else {
        setIsLoading(false);
        hideToast();
        //console.error('Erreur lors de l\'envoi:', response.message);
        Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'envoi de votre demande.');
      }
    }  catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      showToast('Erreur de chargement. Vérifiez votre connexion internet.');
      setIsLoading(false); // Arrêter le chargement en cas d'erreur
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'envoi de votre demande.');

    }
  };
  const openTypeDemandeModal = () => {
    setIsTypeDemandeModalVisible(true);
  };

  const closeTypeDemandeModal = () => {
    setIsTypeDemandeModalVisible(false);
  };

  const handleTypeDemandeSelect = (type) => {
    setSelectedTypeDemande(type);
    closeTypeDemandeModal();
  };

  const openChoixModal = () => {
    setIsChoixModalVisible(true);
  };

  const closeChoixModal = () => {
    setIsChoixModalVisible(false);
  };

  const handleChoixSelect = (value) => {
    setChoix(value);
    closeChoixModal();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
 <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <ScrollView contentContainerStyle={styles.inner}>
<View style={styles.sectionHeading}>
        <Text style={styles.sectionHeadingText}>
          Demande d'Autorisation
        </Text>
      </View>

      <View style={styles.MesInput}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          placeholder="Entrez votre nom"
        />

        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={prenom}
          onChangeText={setPrenom}
          placeholder="Entrez votre prénom"
        />

        <Text style={styles.label}>Adresse Email</Text>
        <TextInput
          style={styles.input}
          value={adresseEmail}
          onChangeText={setAdresseEmail}
          keyboardType="email-address"
          placeholder="Entrez votre adresse email"
        />

        <Text style={styles.label}>Numéro de téléphone</Text>
        <TextInput
          style={styles.input}
          value={numeroPhone}
          onChangeText={setNumeroPhone}
          keyboardType="numeric"
          placeholder="Entrez votre numéro de téléphone"
        />

        <Text style={styles.label}>Numéro de la carte biométrique</Text>
        <TextInput
          style={styles.input}
          value={numeroBiometrique}
          onChangeText={setNumeroBiometrique}
          // keyboardType="numeric"
          placeholder="Entrez le numéro de votre carte biométrique"
        />

       {/* Sélection du type de demande */}
       <TouchableOpacity
            style={styles.selectButton}
            onPress={openTypeDemandeModal}
          >
            <Text>{selectedTypeDemande ? selectedTypeDemande.LibelleTypeDemandes : "Sélectionnez un type de demande"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={openChoixModal}
          >
            <Text>{choix}</Text>
          </TouchableOpacity>

          {/* Modal pour le type de demande */}
          <Modal
      transparent
      visible={isTypeDemandeModalVisible}
      animationType="slide"
      onRequestClose={closeTypeDemandeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <FlatList
            data={typesDemande}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleTypeDemandeSelect(item)}
              >
                <Text style={styles.itemText}>{item.LibelleTypeDemandes}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <Button title="Fermer" onPress={closeTypeDemandeModal} color="#009900" />
          </View>
        </View>
      </View>
    </Modal>

          {/* Modal pour le choix import/export */}
          <Modal
            transparent
            visible={isChoixModalVisible}
            animationType="slide"
            onRequestClose={closeChoixModal}
          >

      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
              <FlatList
                data={[{ label: 'NON', value: 'NON' }, { label: 'OUI', value: 'OUI' }]}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleChoixSelect(item.value)}
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
          <View style={styles.buttonContainer}>
              
              <Button title="Fermer" onPress={closeChoixModal} color="#009900" />
           
            </View>
            </View>
            </View>
          </Modal>
        {/* <TouchableOpacity onPress={() => selectDocument('fileCarteBiometric')} style={styles.filePickerButton}>
          <Text>
            Copie de la carte biométrique
            {selectedFiles.fileCarteBiometric && (
              <MaterialIcons name="check-circle" size={20} color="green" />
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => selectDocument('certificat')} style={styles.filePickerButton}>
          <Text>
            Certificat
            {selectedFiles.certificat && (
              <MaterialIcons name="check-circle" size={20} color="green" />
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => selectDocument('LettreManuscrite')} style={styles.filePickerButton}>
          <Text>
            Lettre Manuscrite
            {selectedFiles.LettreManuscrite && (
              <MaterialIcons name="check-circle" size={20} color="green" />
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => selectDocument('documentRCCM')} style={styles.filePickerButton}>
          <Text>
            Document RCCM
            {selectedFiles.documentRCCM && (
              <MaterialIcons name="check-circle" size={20} color="green" />
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEnvoyer} style={styles.btn}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" /> // Indicateur de chargement
          ) : (
            <Text style={styles.TextBtn}>Envoyer</Text>
          )}
        </TouchableOpacity> */}
                <View style={styles.filePickerRow}>
          <TouchableOpacity
            onPress={() => selectDocument('fileCarteBiometric')}
            style={[styles.filePickerButton, styles.filePickerBackground]}
          >
            <MaterialIcons name="insert-drive-file" size={24} color="black" />
            <Text>Carte Biometric</Text>
            {selectedFiles.fileCarteBiometric && (
              <MaterialIcons name="check-circle" size={20} color="green" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectDocument('certificat')}
            style={[styles.filePickerButton, styles.filePickerBackground]}
          >
            <MaterialIcons name="insert-drive-file" size={24} color="black" />
            <Text>Certificat</Text>
            {selectedFiles.certificat && (
              <MaterialIcons name="check-circle" size={20} color="green" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.filePickerRow}>
          <TouchableOpacity
            onPress={() => selectDocument('LettreManuscrite')}
            style={[styles.filePickerButton, styles.filePickerBackground]}
          >
            <MaterialIcons name="insert-drive-file" size={24} color="black" />
            <Text>Lettre Manuscrite</Text>
            {selectedFiles.LettreManuscrite && (
              <MaterialIcons name="check-circle" size={20} color="green" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectDocument('documentRCCM')}
            style={[styles.filePickerButton, styles.filePickerBackground]}
          >
            <MaterialIcons name="insert-drive-file" size={24} color="black" />
            <Text>Document RCCM</Text>
            {selectedFiles.documentRCCM && (
              <MaterialIcons name="check-circle" size={20} color="green" />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleEnvoyer} style={styles.btn}>
  {isLoading ? (
    <ActivityIndicator size="small" color="#fff" /> // Affiche le chargement pendant l'envoi
  ) : (
    <Text style={styles.TextBtn}>Envoyer</Text> // Affiche le texte "Envoyer" après l'envoi ou en cas d'erreur
  )}
</TouchableOpacity>

      </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default DemandeOtorisation;
