// styles\managerDashboardStyles.js
import { StyleSheet } from 'react-native';
import { globalStyles } from './globalStyles';

const managerDashboardStyles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    ...globalStyles.title,
    marginTop: 10,
  },
  welcomeText: {
    alignSelf: 'flex-start',
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  button: {
    ...globalStyles.button,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...globalStyles.buttonText,
  },
});

export default managerDashboardStyles;