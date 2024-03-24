// screens/TasksScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/tasksScreenStyles';
import { fetchTasks } from '../services/taskService';

const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadTasks = async () => {
    setLoading(true);
    let fetchedTasks = await fetchTasks();
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  useEffect(() => {
    const initializeTasks = async () => {
      const tasksFromDb = await fetchTasks();
      setTasks(tasksFromDb);
      setLoading(false);
    };

    initializeTasks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('CreateTaskScreen')} style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterButtonsContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>All tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Completed tasks</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        // Show loading indicator or message when tasks are loading
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingMessage}>Tasks Loading...</Text>
        </View>
      ) : (
        // Render the task list or "No tasks available" message if not loading
        <ScrollView>
          {tasks.map((item) => {
            const weatherInfo = item.weather && item.weather.list && item.weather.list.length > 0
                              ? `  ${Math.round(item.weather.list[0].main.temp - 273.15)}°C, ${item.weather.list[0].weather[0].description}`
                              : ' Weather data not available';

            return (
              <TouchableOpacity
                key={item.task_id.toString()}
                onPress={() => navigation.navigate('TaskDetailScreen', { taskId: item.task_id })}
                style={styles.taskCard}
              >
                <View style={[styles.statusIndicator, { backgroundColor: item.status === 'completed' ? 'green' : 'orange' }]}/>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.weatherInfo}>{weatherInfo}</Text>
              </TouchableOpacity>
            );
          })}
          {tasks.length === 0 && <Text style={styles.emptyMessage}>No tasks available. Add some tasks!</Text>}
        </ScrollView>
      )}
    </View>
  );
};

export default TasksScreen;