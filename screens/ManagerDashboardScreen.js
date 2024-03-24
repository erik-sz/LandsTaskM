// screens/ManagerDashboardScreen.js 
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/managerDashboardStyles';
import { signOut } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';
import { getUserNameFromEmail, createCompany, updateUserProfileWithIsManagerFlag, updateUserProfileWithCompanyId } from '../services/registrationApi';
import TaskCard from '../components/TaskCard';
import ProjectCard from '../components/ProjectCard';


const ManagerDashboardScreen = () => {
  const navigation = useNavigation();
  const [userName, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  console.log("ManagerDashboardScreen called at: ", new Date(), "\n");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userObject = await supabase.auth.getUser();
        
        if (userObject && userObject.data && userObject.data.user) {
          const { id, email } = userObject.data.user;
          setUserId(id);
          console.log("User email: ", email, "User ID: ", id, "at: ", new Date(), "\n");

          if (email) {
            setUsername(await getUserNameFromEmail(email));
          } else {
            console.error("Email is undefined for the user object.");
          }
        } else {
          console.error("User object is undefined.");
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      if (userId) {
        console.log("dashboard initialization test: ", userId, "at: ", new Date(), "\n");
        try {
          const isManager = await AsyncStorage.getItem('isManager');
          const company = await AsyncStorage.getItem('company');
          const isManagerFirstRegistered = await AsyncStorage.getItem('isManagerFirstRegistered') === 'true';

          if (isManagerFirstRegistered && isManager === 'true') {
            await updateUserProfileWithIsManagerFlag(userId, true);
            const companyResponse = await createCompany(company);
            if (companyResponse) { 
              console.log("Updating user profile with company ID: ", companyResponse.company_id ," for user: ", userId);
              await updateUserProfileWithCompanyId(userId, companyResponse.company_id);
            }
            await AsyncStorage.setItem('isManagerFirstRegistered', 'false');
          }
        } catch (error) {
          console.error('Error initializing dashboard: ', error);
        }
      }
    };

    initializeDashboard();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Logout successful at: ", new Date(), "\n");
    } catch (error) {
      Alert.alert('Logout Error: ', error.error_description || error.message);
    }
  };
  
  const navigateToTasks = () => {
    navigation.navigate('TasksScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manager Dashboard</Text>
      <Text style={styles.welcomeText}>Hello {userName}!</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <TouchableOpacity onPress={navigateToTasks}>
          <TaskCard taskCount={18} />
        </TouchableOpacity>
        <ProjectCard projectCount={9} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManagerDashboardScreen;