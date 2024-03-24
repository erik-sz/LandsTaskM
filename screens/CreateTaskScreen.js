// screens/CreateTaskScreen.js
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/createTaskStyles';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createTask, fetchCompanyId } from '../services/taskService';
import { fetchWeatherData } from '../services/weatherService';

const CreateTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('low');
	const [dueDate, setDueDate] = useState(new Date());  
	const [impact, setImpact] = useState('low');
  const [riskDescription, setRiskDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const navigation = useNavigation();

  // Fetch the location from AsyncStorage when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchLocation = async () => {
        const locationString = await AsyncStorage.getItem('selectedLocation');
        if (locationString) {
          const location = JSON.parse(locationString);
          setSelectedLocation(location);
          await AsyncStorage.removeItem('selectedLocation');
        }
      };
  
      fetchLocation();
    }, [])
  );

  // Adjusting the display of the location selection title or placeholder
  const locationDisplayText = selectedLocation?.formatted_address ? `Address: ${selectedLocation.formatted_address}` : "Select Location";

  // Function to handle saving the task to the database (not implemented)
	const handleSaveTask = async () => {
		try {
			const company_id = await fetchCompanyId();
			if (!company_id) {
				console.error('Failed to retrieve company_id for user');
				return;
			}

      let weatherData = null;

      // Check if a location is selected and fetch weather data
      if (selectedLocation && selectedLocation.geometry && selectedLocation.geometry.location) {
        const lat = selectedLocation.geometry.location.lat;
        const lon = selectedLocation.geometry.location.lng;

        try {
          const weatherResponse = await fetchWeatherData(lat, lon);
          weatherData = weatherResponse;
        } catch (error) {
          console.error('Failed to fetch weather data:', error);
        }
      }

      const task = {
        title,
        description,
        status,
        priority,
        due_date: dueDate.toISOString().split('T')[0],
        impact,
        risk_description: riskDescription,
        company_id,
        location: selectedLocation,
        weather: weatherData,
      };
	
			// Save the task to the database
			const newTask = await createTask(task);
			console.log('New task saved successfully:', newTask);
			navigation.navigate('TasksScreen');
		} catch (error) {
			console.error('Error saving the new task:', error);
		}
	};

	const showDatepicker = () => {
    setShowDatePicker(true);
  };

	const onChangeDate = (event, selectedDate) => {
    // If 'selectedDate' is undefined, return early without updating the state
    if (selectedDate === undefined) {
      setShowDatePicker(false);
      return;
    }

    // If 'selectedDate' is valid, update the state and hide the date picker
    setDueDate(selectedDate);
    setShowDatePicker(false);
  };

  const navigateLocationPicker = () => { 
    navigation.navigate('MapLocationPickerScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('TasksScreen')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Task</Text>

        {/* Buttons to save the task details */}
        <View style={[styles.buttonContainer, { width: '45%'} ]}>
          <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
            <Text style={styles.buttonText}>Save Task</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Task Title text input */}
      <Text style={styles.placeholderTitle}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Work on paving"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor= "#c2c2c2"
      />

      {/* Descriptionn text input */}
      <Text style={styles.placeholderTitle}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Description and notes"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor= "#c2c2c2"
      />

      {/* Task Status value picker */}
      <Text style={styles.placeholderTitle}>Status</Text>
      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}>
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="In Progress" value="in_progress" />
        <Picker.Item label="Completed" value="completed" />
        <Picker.Item label="Cancelled" value="cancelled" />
        <Picker.Item label="To be started" value="to_start" />
      </Picker>
      
      {/* Task Priority value picker */}
      <Text style={styles.placeholderTitle}>Priority</Text>
      <Picker
        selectedValue={priority}
        style={styles.picker}
        onValueChange={(itemValue) => setPriority(itemValue)}>
        <Picker.Item label="Low" value="low" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="High" value="high" /> 
      </Picker>

      {/* Task due date value  */}
      <Text style={styles.placeholderTitle}>Due Date</Text>
			<TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
				<Text style={styles.dateText}>
					{dueDate ? dueDate.toLocaleDateString('en-GB') : "Select a date"}
				</Text>
			</TouchableOpacity>

      {/* Task Due Date value picker */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dueDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date(2300, 10, 20)}
          minimumDate={new Date(1950, 0, 1)}
        />
      )}

      {/* MapView to select a location */}
      <Text style={styles.placeholderTitle}>{locationDisplayText}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateLocationPicker} >
          <Text style={styles.buttonText}>Select Location</Text>
        </TouchableOpacity>
      </View>

      {/* Task Risk Description text input */}
      <Text style={styles.placeholderTitle}>Risk</Text>
      <Picker
        selectedValue={riskDescription}
        style={styles.picker}
        onValueChange={(itemValue) => setRiskDescription(itemValue)}>
        <Picker.Item label="HeavyRain" value="HeavyRain" />
        <Picker.Item label="Freezing" value="Freezing" />
        <Picker.Item label="StrongWind" value="StrongWind" /> 
        <Picker.Item label="Heatwave" value="Heatwave" />
        <Picker.Item label="Frost" value="Frost" /> 
        <Picker.Item label="WetConditions" value="WetConditions" /> 
        <Picker.Item label="Risk Free" value="Risk_Free" /> 
      </Picker>

    </ScrollView>
  );
};

export default CreateTaskScreen;