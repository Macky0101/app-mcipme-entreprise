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
    minHeight: 30,
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
  walletContainer: {
    backgroundColor: '#009900',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  walletText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom:7,
  },
  walletAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  walletCard: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 8,
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
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historicBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    width: 200, 
    marginBottom:15
  },
  historicDate: {
    fontSize: 16,
    color: '#333',
  },
  historicProduit: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  historicQuantite: {
    fontSize: 16,
    color: '#666',
  },
  historicImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    marginBottom:5
  },
  noImageText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
 
});

export default styles;




































