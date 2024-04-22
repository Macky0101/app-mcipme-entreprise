import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#ffffff',
    // marginLeft:10,
    // marginRight:10,
  },
  base: {
    flexGrow: 1,
    paddingVertical: 24,
    marginLeft:10,
    marginRight:10,
  },
  section: {},
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 30,
    paddingHorizontal: 24,
    marginBottom:10
  },
  sectionHeadingMain: {
    flexShrink: 1,
  },
  sectionHeadingText: {
    fontSize: 24,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
  logoCard: {
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 3, 
    paddingLeft:10,
    paddingRight:10,
  },
  logo:{
    height:200,
    width:'100%',
  },
  separator: {
    height: 0.5, 
    backgroundColor: 'gray', 
    marginBottom: 10,
    marginTop: 10,
  },
  btn:{
    alignItems: 'flex-start',
  },
  List:{
    marginRight: 15,
    marginLeft: 15,
    marginTop:15,
  },
  ListContent:{
    flexDirection:'column',
  },
  ListContentEspace:{
    marginRight:10
  },
  logoutButton:{
    color:'black',
    fontSize:20,
    textAlign:'center',
    marginTop:50,
    backgroundColor:'#dddddd',
    padding:10,
    marginRight:20,
  },
  profileAction:{
    paddingLeft: 15,

  },
  titreProfilDetail:{
    fontSize:15,
    marginTop:10,
  },
  nav:{
    flexDirection:'row',
  }
  
  });
  
export default styles
  