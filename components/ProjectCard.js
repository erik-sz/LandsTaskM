// components/ProjectCard.js
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/projectCardStyle';

// ProjectCard component to display the project count in the dashboard screen
const ProjectCard = ({ projectCount }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.iconsContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="briefcase" size={24} color="white" />
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name="add" size={24} color="white" />
        </View>
      </View>

      <Text style={styles.cardTitle}>Projects</Text>

      <View style={styles.projectCountContainer}>
        <Text style={styles.projectCountText}>{projectCount}</Text>
      </View>
    </View>
  );
};

export default ProjectCard;