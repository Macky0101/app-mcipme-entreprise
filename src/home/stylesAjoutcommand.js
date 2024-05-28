import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
        submitButton: {
          backgroundColor: '#009900',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
          marginTop: 10,
        },
        submitButtonText: {
          color: '#ffffff',
          fontWeight: 'bold',
        },
        safeAreaView: {
          flex: 1,
          backgroundColor: '#fff',
          padding: 10,
        },
        header: {
          padding: 10,
        },
        headerText: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        form: {
          marginTop: 10,
          padding: 10,
        },
        input: {
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginVertical: 5,
        },
        button: {
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
          padding: 10,
          alignItems: 'center',
          marginBottom: 5,
        },
        modalOverlay: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContainer: {
          height: '100%',
          width: '100%',
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 8,
          alignItems: 'center',
        },
        modalItem: {
          paddingTop:30,
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
          width: '100%',
        },
        closeButton: {
          marginTop: 16,
          padding: 12,
          backgroundColor: '#ff0000',
          borderRadius: 4,
        },
        closeButtonText: {
          color: '#fff',
          fontWeight: 'bold',
        },
        productCard: {
          backgroundColor: '#f9f9f9',
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        },
        MesIconsMdSup: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
        iconButton: {
          marginRight: 20,
        },
      
      
      
      
      
      
      
      
      
      
        
      
      
         title: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 12,
          color: '#333',
          textAlign: 'center',
        },
        section: {
          marginBottom: 16,
          backgroundColor: '#fff',
          borderRadius: 8,
          elevation: 4,
          paddingHorizontal: 16,
          paddingVertical: 16,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 8,
          color: '#333',
        },
        categoryList: {
          marginBottom: 16,
        },
        categoryItem: {
          flex: 1,
          margin: 4,
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: '#fff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ccc',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
        },
        categoryText: {
          fontSize: 16,
          color: '#333',
          textAlign: 'center',
        },
        activeCategory: {
          backgroundColor: '#4CAF50',
          borderColor: '#2E7D32',
        },
        subCategoryItem: {
          paddingVertical: 10,
          paddingHorizontal: 32,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
        },
        subCategoryText: {
          fontSize: 14,
          color: '#555',
        },
        subCategoryList: {
          maxHeight: 200, // Limite de hauteur pour les sous-catégories
        },
        productList: {
          maxHeight: 300, // Limite de hauteur pour les produits
          paddingHorizontal: 20,
        },
        productItem: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
        },
        productInfo: {
          flex: 1,
        },
        productText: {
          fontSize: 16,
          color: '#333',
        },
        productUnit: {
          fontSize: 14,
          color: '#777',
          marginTop: 4,
        },
        productImage: {
          width: 80,
          height: 80,
          borderRadius: 8,
          marginLeft: 16,
        },
        error: {
          color: 'red',
          marginBottom: 16,
          textAlign: 'center',
        },

        dropdownContainer: {
          padding: 5,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
          marginBottom: 10,
        },
        dropdownTextInput: {
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          backgroundColor: '#fff',
          color: '#333',
        },
        dropdownItem: {
          padding: 10,
          marginTop: 2,
          backgroundColor: '#fff',
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
        },
        dropdownItemText: {
          color: '#333',
        },
        dropdownItemsContainer: {
          maxHeight: 150,
        },
        selectedCountryContainer: {
          marginTop: 10,
          padding: 10,
          backgroundColor: '#e0f7fa',
          borderRadius: 5,
        },
        selectedCountryText: {
          color: '#00796b',
        },
      

});
export default styles;