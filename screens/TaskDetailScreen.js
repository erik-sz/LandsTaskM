// screens/TaskDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/taskDetailsStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchTaskById, updateTask, deleteTask } from '../services/taskService';

const TaskDetailScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { taskId } = route.params;
	const [task, setTask] = useState({
		title: '',
		description: '',
		status: 'pending',
		priority: 'low',
		due_date: new Date(),
		impact: 'low',
		risk_description: '',
		assigned_people: '',
		location: '',
	});

	const [editMode, setEditMode] = useState(false);
	const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
	const [priority, setPriority] = useState('low');
	const [riskDescription, setRiskDescription] = useState('');
	const [selectedLocation, setSelectedLocation] = useState(null);

	useEffect(() => {
		// Function to load the task details from the database and set them in state when the component mounts or the task ID changes (e.g. on navigation)
		const loadTaskDetails = async () => {
			try {
				const taskDetails = await fetchTaskById(taskId);
				if (taskDetails) {
					setTask(taskDetails);
					setDueDate(new Date(taskDetails.due_date));
					setPriority(taskDetails.priority);
					setRiskDescription(taskDetails.risk_description);
					
				} else {
					console.log("No task details found for ID:", taskId);
				}
			} catch (error) {
				Alert.alert("Error", "Failed to load task details.");
				console.error("Task fetch error:", error);
			}
		};
		loadTaskDetails();
		const unsubscribe = navigation.addListener('focus', () => {
			// Check for a selected location when the screen is focused
			const fetchSelectedLocation = async () => {
				const locationString = await AsyncStorage.getItem('selectedLocation');
				if (locationString) {
					const location = JSON.parse(locationString);
					setSelectedLocation(location);
					setTask(previousState => ({ ...previousState, location }));
					await AsyncStorage.removeItem('selectedLocation'); // Clean up after retrieval
				}
			};
			fetchSelectedLocation();
		});
	
		return unsubscribe; // Clean up listener when component is unmounted
	}, [navigation, taskId]);

	// Function to handle the change of the risk description picker value and update the task state accordingly
	const onRiskDescriptionChange = (itemValue) => {
		setRiskDescription(itemValue);
		setTask({ ...task, risk_description: itemValue });
	};

	// Function to save the task details to the database and show a success alert on success or an error alert on failure
	const handleSave = async () => {
		if (!editMode) return; // Ensure we're in edit mode
		try {
			// Update the task with the new values and show an alert on success or an error alert on failure
			await updateTask({ ...task, due_date: dueDate, priority, risk_description: riskDescription, location: selectedLocation });
			setEditMode(false);
			Alert.alert("Success", "Task updated successfully.");
		} catch (error) {
			Alert.alert("Error", "Failed to update task.");
			console.error("Update task error:", error);
		}
	};

	// Function to delete the task and navigate back to the Tasks screen on success or show an error alert on failure
	const handleDelete = () => {
		Alert.alert(
			"Confirm Delete",
			"Are you sure you want to delete this task?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Delete cancelled"),
					style: "cancel"
				},
				{ 
					text: "OK", 
					onPress: async () => {
						try {
							await deleteTask(task.task_id);
							navigation.navigate('TasksScreen');
							Alert.alert("Deleted", "Task has been deleted.");
						} catch (error) {
							Alert.alert("Error", "Failed to delete task.");
							console.error("Delete task error:", error);
						}
					} 
				}
			],
			{ cancelable: false }
		);
	};

	// Function to show the date picker when the date input is pressed and hide it when a date is selected or the user cancels
	const showDatepicker = () => {
    setShowDatePicker(true);
	};

	// Sets the task state with the updated value of the specified attribute (e.g. title, description, etc.)
	const onChangeDate = (event, selectedDate) => {
		setDueDate(selectedDate || dueDate); // If 'selectedDate' is undefined, or on cancellation, use the current value
		setShowDatePicker(false);
	};

	// Function to toggle edit mode and reload task details if edit mode is being disabled
	const toggleEditMode = async () => {
		if (editMode) {
			// If currently in edit mode, disable it and reload the task details
			try {
				const taskDetails = await fetchTaskById(taskId);
				if (taskDetails) {
					setTask(taskDetails);
				} else {
					console.log("No task details found for ID:", taskId);
				}
			} catch (error) {
				Alert.alert("Error", "Failed to reload task details.");
				console.error("Task reload error:", error);
			}
		}
		setEditMode(!editMode);
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.navigate('TasksScreen')} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Task Details</Text>
			</View>

			{/* First Row: Enable Edit Button */}
			<View>
				<TouchableOpacity style={styles.button} onPress={toggleEditMode}>
					<Text style={styles.buttonText}>{editMode ? 'Disable Edit' : 'Enable Edit'}</Text>
				</TouchableOpacity>
			</View>

			{/* Conditionally render the second row based on editMode */}
			<View style={[styles.buttonRow, {justifyContent: editMode ? 'space-between' : 'center'}]}>
				{editMode && (
					<TouchableOpacity style={styles.halfButton} onPress={handleSave}>
						<Text style={styles.buttonText}>Update Task</Text>
					</TouchableOpacity>
				)}

				<TouchableOpacity style={[editMode ? styles.halfButton : styles.button]} onPress={handleDelete}>
					<Text style={styles.buttonText}>Delete Task</Text>
				</TouchableOpacity>
			</View>

			{editMode ? (
				// Edit mode: Show TextInputs and Pickers
				<>
					{/* Task Title text input */}
					<Text style={styles.placeholderTitle}>Task Title</Text>
					<TextInput
						style={styles.input}
						value={task.title}
						onChangeText={(text) => setTask({ ...task, title: text })}
					/>

					{/* Description text input */}
					<Text style={styles.placeholderTitle}>Description</Text>
					<TextInput
						style={styles.input}
						value={task.description}
						onChangeText={(text) => setTask({ ...task, description: text })}
						multiline
					/>

					{/* Status picker */}
					<Text style={styles.placeholderTitle}>Status</Text>
					<Picker
						selectedValue={task.status}
						style={styles.picker}
						onValueChange={(itemValue) => setTask({ ...task, status: itemValue })}>
						<Picker.Item label="Pending" value="pending" />
						<Picker.Item label="In Progress" value="in_progress" />
						<Picker.Item label="Completed" value="completed" />
						<Picker.Item label="Cancelled" value="cancelled" />
						<Picker.Item label="To be started" value="to_start" />
					</Picker>
					
					{/* Priority picker */}
					<Text style={styles.placeholderTitle}>Priority</Text>
					<Picker
						selectedValue={priority}
						style={styles.picker}
						onValueChange={(itemValue) => setPriority(itemValue)}>
						<Picker.Item label="Low" value="low" />
						<Picker.Item label="Medium" value="medium" />
						<Picker.Item label="High" value="high" /> 
					</Picker>

					{/* Display current address */}
					<Text style={styles.placeholderTitle}>Address: <Text style={styles.detailText}>{task.location && task.location.formatted_address ? task.location.formatted_address : 'No address provided'}</Text></Text>
					{/* Select location button */}
					<TouchableOpacity	style={styles.button}	onPress={() => navigation.navigate('MapLocationPickerScreen', { taskId: task.task_id })}>
						<Text style={styles.buttonText}>Select Location</Text>
					</TouchableOpacity>

					{/* Due Date picker */}
					<Text style={styles.placeholderTitle}>Expected Due Date</Text>
					<TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
						<Text style={styles.dateText}>
							{dueDate ? dueDate.toLocaleDateString('en-GB') : "Select a date"}
						</Text>
					</TouchableOpacity>

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

					{/* Risk Description picker */}
					<Text style={styles.placeholderTitle}>Risk</Text>
					<Picker
						selectedValue={riskDescription}
						style={styles.picker}
						onValueChange={(itemValue) => onRiskDescriptionChange(itemValue)}>
						<Picker.Item label="Heavy Rain" value="HeavyRain" />
						<Picker.Item label="Freezing" value="Freezing" />
						<Picker.Item label="Strong Wind" value="StrongWind" /> 
						<Picker.Item label="Heatwave" value="Heatwave" />
						<Picker.Item label="Frost" value="Frost" /> 
						<Picker.Item label="Wet Conditions" value="WetConditions" /> 
						<Picker.Item label="Risk Free" value="Risk_Free" /> 
					</Picker>
				</>
			) : (
				// Read mode: Display values as text only
				<>
					<View style={styles.detailsContainer}>
						<View style={styles.rowContainer}>
							<Text style={styles.detailTextTitle}>Title: <Text style={styles.detailText}>{task.title}</Text></Text>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.detailTextTitle}>Description: <Text style={styles.detailText}>{task.description}</Text></Text>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.detailTextTitle}>Status: <Text style={styles.detailText}>{task.status}</Text></Text>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.detailTextTitle}>Due Date: <Text style={styles.detailText}>{dueDate.toDateString()}</Text></Text>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.detailTextTitle}>Priority: <Text style={styles.detailText}>{task.priority}</Text></Text>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.detailTextTitle}>Impact: <Text style={styles.detailText}>{task.impact}</Text></Text>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.detailTextTitle}>Risk Description: <Text style={styles.detailText}>{task.risk_description}</Text></Text>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.detailTextTitle}>Address: <Text style={styles.detailText}>
									{task.location && task.location.formatted_address ? task.location.formatted_address : 'No address provided'}
								</Text>
							</Text>
						</View>
					</View>
				</>
			)}

		</ScrollView>
	);
};

export default TaskDetailScreen;