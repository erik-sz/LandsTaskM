// styles/createTaskStyles.js
import { StyleSheet } from 'react-native';
import { globalStyles } from './globalStyles';

const createTaskStyles = StyleSheet.create({
  ...globalStyles,
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 22,
    color: '#FFF',
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#FFF',
  },
  picker: {
    backgroundColor: '#333',
    color: '#c2c2c2',
    marginBottom: 10,
    borderRadius: 18,
  },
  map: {
    width: '100%',
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 37,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  dateInput: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },
  dateText: {
    color: '#c2c2c2',
    fontSize: 16,
  },
  placeholderTitle: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
    paddingLeft: 15,
  },
  backButton: {
    ...globalStyles.backButton,
  },
});

export default createTaskStyles;