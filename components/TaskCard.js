// components/TaskCard.js
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/taskCardStyles';

// TaskCard component to display the task count in the dashboard screen
const TaskCard = ({ taskCount }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.iconsContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="folder-open" size={24} color="white" />
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="add" size={24} color="white" />
          </View>
        </View>
  
        <Text style={styles.cardTitle}>Tasks</Text>
  
        <View style={styles.taskCountContainer}>
          <Text style={styles.taskCountText}>{taskCount}</Text>
        </View>
      </View>
    );
  };

export default TaskCard;