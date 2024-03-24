// App.js
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './utils/supabase';

import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ManagerDashboardScreen from './screens/ManagerDashboardScreen';
import WorkerDashboardScreen from './screens/WorkerDashboardScreen';
import TasksScreen from './screens/TasksScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import MapLocationPickerScreen from './screens/MapLocationPickerScreen';

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

const AuthNavigation = () => (
  <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Registration" component={RegistrationScreen} />
  </AuthStack.Navigator>
);

const MainAppNavigation = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    {/* Conditional rendering based on user role or preference */}
    <MainStack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} />
    <MainStack.Screen name="WorkerDashboard" component={WorkerDashboardScreen} />
    <MainStack.Screen name="TasksScreen" component={TasksScreen} />
    <MainStack.Screen name="CreateTaskScreen" component={CreateTaskScreen} />
    <MainStack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
    <MainStack.Screen name="MapLocationPickerScreen" component={MapLocationPickerScreen} />
    {/* Define other screens accessible post-authentication */}
  </MainStack.Navigator>
);

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionCheck = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };

    sessionCheck();

    setIsLoading(true);
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    if(isLoading) {
      return () => {
        if (authListener && authListener.data && typeof authListener.data.unsubscribe === 'function') {
          authListener.data.unsubscribe();
        }
      };
    }
  }, []);

  return (
    <>
      <NavigationContainer>
        {session ? <MainAppNavigation /> : <AuthNavigation />}
      </NavigationContainer>
      <StatusBar style="light" backgroundColor='#000' />
    </>
  );
}