// styles/globalStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const globalStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginBottom: 40,
    marginVertical: 0,
  },
  placeholderTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  button: {
    height: 48,
    borderRadius: 37,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    height: 48,
    borderRadius: 18,
    backgroundColor: '#333333',
    color: '#C1C1C1',
    fontSize: 14,
    fontFamily: 'Roboto',
    padding: 8,
    borderWidth: 0,
    width: '100%',
    marginBottom: 10,    
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#007AFF',
    borderRadius: 19,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 19,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { globalStyles, windowWidth, windowHeight };