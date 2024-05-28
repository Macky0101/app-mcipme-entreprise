import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginLeft: 10,
    marginRight: 10,
  },
  base: {
    flexGrow: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 30,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  sectionHeadingMain: {
    flexShrink: 1,
  },
  sectionHeadingText: {
    fontSize: 24,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
  label: {
    marginBottom: 5,
  },
  MesInput: {
    marginTop: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  btn: {
    marginTop: 10,
    backgroundColor: '#009900',
    padding: 10,
    borderRadius: 7,
  },
  TextBtn: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  // dropdown
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  label: {
    fontSize: 14, // Taille de texte réduite
    marginBottom: 5, // Moins d'espace entre le texte et le picker
  },
  //mesfilePicker
  filePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ou 'space-around' pour plus d'espace
    padding: 16,
  },
  filePickerButton: {
    flex: 1, // Pour que les éléments aient une largeur égale
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8, // Pour espacer les éléments
  },
  filePickerBackground: {
    backgroundColor: '#f5f5f5', // Couleur de fond légère
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btn: {
    margin: 16,
    backgroundColor: '#009900', // Couleur de bouton
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  TextBtn: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay to highlight the modal
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectButton: {
    padding: 10,
    backgroundColor: '#f5f5f5', // Couleur claire pour le bouton
    borderRadius: 5, // Bords arrondis
  },
});

export default styles;
