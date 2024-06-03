import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  greetingText: {
    fontSize: 18, 
    color: '#6a6a6a', 
  },
  userNameText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
  },
  logo: {
    width: 100, 
    height: 50, 
    margin: 10, 
    borderRadius: 25, // Pour un cercle parfait (si l'image doit être ronde)
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 70,
    paddingHorizontal: 24,
    marginBottom: 10
  },
  sectionHeadingMain: {
    flexShrink: 1,
  },
  sectionHeadingText: {
    fontSize: 24,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row', // Pour avoir des cartes côte à côte
    justifyContent: 'space-between', // Pour espacer les cartes
    flexWrap: 'wrap', // Pour permettre aux cartes de s'adapter
  },
  mestotaux: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // Center items vertically
  },
  contenttotaux: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  walletContainer: {
    backgroundColor: '#009960',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  walletText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 7,
  },
  walletAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  separator: {
    width: 1,
    height: '100%', // Match the height of the container
    backgroundColor: '#FFF', // White color for the separator
    marginHorizontal: 20, // Space around the separator
  },
    walletCard: {
    color: '#FFF',
    fontSize: 13,
    marginTop: 15,
    justifyContent: 'flex-end',
  },
  ListProduc:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  productsHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#009900', // Fond bleu
    borderRadius: 8, // Coins légèrement arrondis
    paddingVertical: 10, // Espace vertical à l'intérieur du bouton
    paddingHorizontal: 20, // Espace horizontal à l'intérieur du bouton
  },
  addButtonText: {
    color: '#ffffff', // Texte en blanc
    fontSize: 12, // Taille de la police
    fontWeight: 'bold', // Texte en gras
  },
  historicsContainer: {
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContainer: {
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16, // Espace entre les rangées
  },
  historicItem: {
    flex: 1,
    padding: 16,
    margin: 4,
    alignItems: 'center', // Centre l'image et le texte
  },
  productImage: {
    width: 100, // Ajustez la taille selon vos besoins
    height: 100, // Ajustez la taille selon vos besoins
    borderRadius: 50, // Assure que l'image est ronde
    marginBottom: 8, // Espace entre l'image et le texte
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stockInfo: {
    fontSize: 14,
    marginVertical: 4,
    color:'#009900'
  },
  noImageText: {
    color: '#999',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#009900'
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#009900',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default styles;




































