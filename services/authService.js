// services/authService.js
import { supabase } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// sign up with email and password
export const signUpWithEmail = async (email, password) => {
  console.log("signUpWithEmail called with email:", email);
  try {
    const { user, error } = await supabase.auth.signUp({ email, password, disableVerification: true});

    // Check if there's an error first
    if (error) {
      console.error("Registration error at:", new Date(), "error:", error);
      throw new Error(error.message);
    }
    return user;

  } catch (error) {
    console.error("Exception in signUpWithEmail:", error);
    throw error;
  }
};

// sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    console.log("signInWithEmail called with user email:", user.email, "at:", new Date());
    return user;
  } catch (error) {
    throw error;
  }
};

// sign out method
export const signOut = async () => {
  // console to show that user email initiated logout
  console.log("signOut called \n")
  // Call the signOut method from the supabase auth object
  const { error } = await supabase.auth.signOut();

  // If sign-out is successful remove user ID from async store
  if (!error) {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('isManagerFirstRegistered');
    await AsyncStorage.removeItem('isManager');
    await AsyncStorage.removeItem('company');
  }

  // console to show if logout was succesfull at current time
  console.log("signOut called at:", new Date(), "with error:", error, "\n")

  if (error) {
    throw error;
  }
};

// get user ID from database and return user ID
export const getUserId = async () => {
  const userObject = await supabase.auth.getUser();
  if (userObject) {
      return userObject.data.user.id;
  }
  return null;
};