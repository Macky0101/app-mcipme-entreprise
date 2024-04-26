import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    justifyContent: 'flex-start',
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
  card: {
    flex: 1,
    // backgroundColor: 'rgba(000, 000, 000, 0.1)',
    backgroundColor:'#ccefff',
    padding: 16,
    marginHorizontal: 2,
  },
  card2: {
    flex: 1,
    // backgroundColor: 'rgba(000, 000, 000, 0.1)',
    backgroundColor:'#fff9cc',
    padding: 16,
    marginHorizontal: 2,
  },
  card3: {
    flex: 1,
    // backgroundColor: 'rgba(000, 000, 000, 0.1)',
    backgroundColor:'#ccffcc',
    padding: 16,
    marginHorizontal: 2,
  },
  card4: {
    flex: 1,
    // backgroundColor: 'rgba(000, 000, 000, 0.1)',
    backgroundColor:'#ffcccc',
    padding: 16,
    marginHorizontal: 2,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  total: {
    color: 'red',
    fontSize: 24,
    marginTop: 0
  },
  sectionCommand:{
    flexDirection:'row',
    justifyContent:'space-between',
    // marginTop:10
  },
  title:{
    fontSize:16,
    marginLeft:5,
    marginTop:10,
    paddingBottom:5
  },
  separator: {
    height: 0.5, 
    backgroundColor: 'gray', 
    marginBottom: 10,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dddddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom:10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchbar: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding:10

  },
});

export default styles;
