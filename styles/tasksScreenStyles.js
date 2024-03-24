// styles/taskScreenStyles.js
import { StyleSheet } from 'react-native';
import { globalStyles } from './globalStyles';
 
const styles = StyleSheet.create({
  ...globalStyles,
  container: {
    ...globalStyles.container,
    alignItems: 'stretch',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  taskCard: {
    backgroundColor: '#333',
    borderRadius: 37,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  weatherInfo: {
    color: '#BBB',
    fontSize: 14,
  },
  emptyMessage: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingMessage: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default styles;