// styles/loginStyles.js
import { StyleSheet } from 'react-native';
import { globalStyles, windowWidth, windowHeight } from './globalStyles';

const loginStyles = StyleSheet.create({
  ...globalStyles,
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  container2: {
    alignItems: 'center',
    backgroundColor: '#000',
    minHeight: windowHeight,
    paddingHorizontal: 10,
  },
  headerImage: {
    top: 0,
    width: windowWidth,
    height: windowHeight * 0.3,
    resizeMode: 'cover',
  },
  title: {
    ...globalStyles.title,
    top: 10,
    alignSelf: 'flex-start',
  },
  placeholderTitle: {
    ...globalStyles.placeholderTitle,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 20,
  },
  input: {
    ...globalStyles.input,
    borderWidth: 0,
  },
  button: {
    ...globalStyles.button,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...globalStyles.buttonText,
  },
  errorText: {
    ...globalStyles.errorText,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  horizontalDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#a9a9a9',
    borderRadius: 2,
  },
  orText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Roboto',
    lineHeight: 18,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 18,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    height: '100%',
    justifyContent: 'center',
    zIndex: 1,
  },
  emailIcon: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default loginStyles;