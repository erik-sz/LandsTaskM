// styles/taskCardStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth / 2 - 30;

const taskCardStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#333',
    width: cardWidth,
    height: cardWidth,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#FFA500',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    marginVertical: 20,
  },
  taskCountContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#FFA500',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  taskCountText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default taskCardStyles;