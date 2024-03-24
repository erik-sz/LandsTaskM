// screens/MapLocationPickerScreen.js
import React, { useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/mapLocationPickerStyles';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Function to get the API key safely
const getGoogleMapsApiKey = () => {
  const apiKey = Constants.expoConfig.extra.googleMapsAPIkey;
  return apiKey;
};

const MapLocationPickerScreen = () => {
  const navigation = useNavigation();
  const googleMapsApiKey = getGoogleMapsApiKey();
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [isLocationSelected, setIsLocationSelected] = useState(false);

const handleSelectLocation = async (data, details) => {
	// Extract only the required parts of the location details
	const location = {
			address_components: details.address_components,
			adr_address: details.adr_address,
			formatted_address: details.formatted_address,
			geometry: {
					location: details.geometry.location,
					viewport: details.geometry.viewport,
			},
	};
	setSelectedLocation(location);
	setIsLocationSelected(true);
};
	// Check if the Google Maps API key is set in the app.json
  if (!googleMapsApiKey) {
    return (
      <View style={styles.container}>
        <Text>Please configure your Google Maps API key.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

				<TouchableOpacity
					style={[styles.button, !isLocationSelected && styles.disabledButton]}
					onPress={() => {
						if (isLocationSelected) {
							console.log("Selected location:", selectedLocation);
							AsyncStorage.setItem('selectedLocation', JSON.stringify(selectedLocation))
								.then(() => {
									navigation.goBack();
								})
								.catch((error) => {
									console.error("AsyncStorage error: ", error);
								});
						}
					}}
					disabled={!isLocationSelected}
				>
					<Text style={[styles.buttonText, !isLocationSelected && styles.disabledButtonText]} >Select Location</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.placeholderTitle}>Select Location</Text>

				<View style={styles.inputWrapper}>
					<GooglePlacesAutocomplete
						placeholder="Type address..."
						onPress={handleSelectLocation}
						query={{
							key: googleMapsApiKey,
							language: 'en',
						}}
						styles={{
							textInputContainer: styles.textInputContainer,
							textInput: styles.input,
						}}
						fetchDetails={true}
						debounce={200} // Add debounce time for efficient API usage (default is 200ms) 
					/>
				</View>
			</View>

    </View>
  );
};

export default MapLocationPickerScreen;