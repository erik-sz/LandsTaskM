// styles/taskDetailsStyles.js
import { StyleSheet } from 'react-native';
import { globalStyles, windowHeight, windowWidth } from './globalStyles';

const styles = StyleSheet.create({
  ...globalStyles,
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    ...globalStyles,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    marginLeft: 10,
  },
  input: {
    ...globalStyles.input,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    width: '100%',
  },
  picker: {
    backgroundColor: '#333',
    color: '#FFF',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  button: {
    ...globalStyles.button,
    width: '100%',
    marginHorizontal: 0,
  },
  halfButton: {
    ...globalStyles.button,
    width: windowWidth / 2 - 30,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  buttonText: {
    ...globalStyles.buttonText,
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
    color: '#FFF',
    fontSize: 16,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  taskTitle: {
    color: '#FFF',
    fontSize: 18,
  },
  emptyMessage: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  detailsContainer: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  detailTeaxtContainer: {
    marginBottom: 10,
  },
  detailText: {
    color: '#FFF',
    marginBottom: 5,
    fontWeight: 'normal',
  },
  detailTextTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  placeholderTitle: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
    paddingLeft: 15,
  },
});

export default styles;