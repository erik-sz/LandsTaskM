// styles/mapLocationPickerStyles.js
import { StyleSheet } from 'react-native';
import { globalStyles, windowWidth, windowHeight } from './globalStyles';

const styles = StyleSheet.create({
	...globalStyles,
	container: {
		...globalStyles.container,
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		padding: 20,
	},
	header: {
		...globalStyles.header,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	headerTitle: {
		...globalStyles.title,
		fontSize: 22,
		backgroundColor: 'red',
	},
	placeholderTitle: {	
		...globalStyles.placeholderTitle,
		fontSize: 18,
	},
	button: {
		...globalStyles.button,
		width: '50%',
	},
	buttonText: {
		...globalStyles.buttonText,
		color: '#FFF',
	},
	disabledButton: {
		backgroundColor: '#CCCCCC',
		width: '50%',
	},
	disabledButtonText: {
		color: '#000',
	},
	backButton: {
		...globalStyles.backButton,
	},
	inputContainer: {
		flex: 1,
		backgroundColor: '#000',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
		marginTop: 20,
	},
	inputWrapper: {
		width: '100%',
		height: windowHeight * 0.4,
		backgroundColor: 'transparent',
	},
	input: {
		...globalStyles.input,
		width: '100%',
		fontSize: 16,
	},
	textInputContainer: {
		width: '100%',
	},
	map: {
		width: windowWidth,
		height: windowHeight,
	},
});

export default styles;
