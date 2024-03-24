import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth / 2 - 30;

const projectCardStyles = StyleSheet.create({
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
    backgroundColor: '#008000',
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
  projectCountContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#008000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  projectCountText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default projectCardStyles;