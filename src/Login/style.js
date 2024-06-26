import { StyleSheet } from "react-native";

const styles = StyleSheet.create({


    safeAreaView: {
        flex: 1,
        backgroundColor: '#ffffff',
      },
      base: {
        flexGrow: 1,
        // paddingVertical: 24,
        marginLeft:10,
        marginRight:10,
      },
      section: {},
      sectionHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 30,
        paddingHorizontal: 24,
        marginBottom:10
      },
      sectionHeadingMain: {
        flexShrink: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      sectionHeadingText: {
        fontSize: 24,
        color: '#1c1c1c',
        fontWeight: 'bold',
      },
      sectionContent: {
        paddingHorizontal: 24,
        paddingVertical: 10,
      },
      container:{
        marginLeft:10,
        marginRight:10
      },
    MesInput:{
        marginTop:10,
      },
      input: {
        height: 40,
        width: "100%",
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10, // Ajoutez un padding à gauche
        paddingRight: 10, // Ajoutez un padding à droite
      },
      
      label:{
        marginBottom:5,
      },
      //buttom
      btnModifierMission :{
        marginTop:10,
        backgroundColor: '#009900',
        padding:10,
        borderColor:'none',
        borderRadius:7,
        marginBottom:30
      },
      TextBtn:{
        textAlign: 'center',
        fontSize:16,
        color: 'white',
      },
      loginTop: {
        minHeight: 250,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
      },
      loginTopLogo: {
        width: 300,
        height: 105,
      },
      connexion:{
        textAlign: 'center',
        fontSize:26,
      },
      errorMessage: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
      },
      button: {
        flexDirection: 'row',
        alignItems: 'center', // Alignement horizontal
        justifyContent: 'center', // Centrer le contenu
        backgroundColor: '#000000', // Bleu attractif
        paddingVertical: 10, // Pour donner de l'espace
        paddingHorizontal: 20, // Pour donner de l'espace
        borderRadius: 8, // Coins arrondis
        shadowColor: '#000', // Couleur de l'ombre
        shadowOffset: { width: 0, height: 2 }, // Position de l'ombre
        shadowOpacity: 0.3, // Opacité de l'ombre
        shadowRadius: 4, // Rayon de l'ombre
        elevation: 5, // Pour Android, donner de la profondeur
      },
      buttonText: {
        color: '#fff', // Texte en blanc pour le contraste
        fontWeight: 'bold', // Texte en gras pour visibilité
        marginLeft: 8, // Pour l'espace entre l'icône et le texte
      },
  });
  
export default styles
  