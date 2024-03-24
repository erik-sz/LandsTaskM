// screens/RegistrationScreen.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, Image, Keyboard, Dimensions } from 'react-native';
import loginStyles from '../styles/loginStyles';
import { signUpWithEmail } from '../services/authService';
import { emailValidator,  passwordStrengthValidator, confirmPasswordValidator } from '../utils/validators';
import { supabase } from '../utils/supabase';
import { Entypo } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom validator for the company name text input
const companyValidator = (companyName) => {
  let errors = {};
  let isValid = true;

  if (!companyName) {
    errors.company = 'Company name is required';
    isValid = false;
  }

  return { isValid, errors };
};

const RegistrationScreen = ({ navigation, route }) => {
  console.log("RegistrationScreen called at: ", new Date(), "\n")
  const {email: passedEmail} = route.params || { email: '' };
  const {isManager} = route.params || { isManager: false };
  const [email, setEmail] = useState(passedEmail);
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isCompanyNameValid, setIsCompanyNameValid] = useState(false);
  const [emailErrors, setEmailErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [company, setCompany] = useState(''); 
  const [companyErrors, setCompanyErrors] = useState({});
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const HorizontalDivider = () => (
    <View style={loginStyles.horizontalDivider} />
  );
  
  const OrText = ({ text = 'or' }) => (
    <Text style={loginStyles.orText}>{text}</Text>
  );

  // Function to handle the email change and validation
  const handleEmailChange = (text) => {
    setEmail(text);
    const validationResults = emailValidator({ email: text });
    setIsEmailValid(validationResults.isValid);
    setEmailErrors(validationResults.errors);
  };

  // Function to handle the company name change and validation
  const handleCompanyNameChange = (text) => {
    setCompany(text);
    const validationResults = companyValidator(text);
    setIsCompanyNameValid(validationResults.isValid);
    setCompanyErrors(validationResults.errors);
  };

  // Function to handle the password change and validation
  const handlePasswordChange = (text) => {
    setPassword(text);
    const validationResults = passwordStrengthValidator(text);
    setIsPasswordValid(validationResults.isValid);
    setPasswordErrors(validationResults.errors);
  };

  // Function to handle the confirm password change and validation
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    const validationResults = confirmPasswordValidator(password, text);
    setIsConfirmPasswordValid(validationResults.isValid);
    setConfirmPasswordErrors(validationResults.errors);
  };

  // Function to handle the sign up process
  const handleSignUp = async () => {
    setIsRegistering(true);
  
    await AsyncStorage.setItem('company', company);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('isManager', isManager.toString());
    if (isManager) {
      await AsyncStorage.setItem('isManagerFirstRegistered', 'true');
    } else {
      await AsyncStorage.setItem('isManagerFirstRegistered', 'false');
    }
    
    try {
      const user = await signUpWithEmail(email, password);
      console.log("User registered successfully at:", new Date(), "with user email:", user?.email, "\n")
      Alert.alert('Registration Successful', 'You are now registered and logged in.');
      navigation.navigate(isManager ? 'ManagerDashboard' : 'WorkerDashboard');
    } catch (error) {
      Alert.alert('Registration Error', error.message || 'An error occurred during registration.');
    } finally {
    setIsRegistering(false);
    }
  };

  // Function to toggle the password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  // Function to toggle the confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  // Fetch the signed URL for the image on mount
  useEffect(() => {
    (async () => {
      const signedUrl = await fetchSignedUrl();
      if (signedUrl) {
        setImageUrl(signedUrl);
      }
    })();
  }, []);

  // Keyboard listeners to adjust the screen when the keyboard is shown
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      const screenHeight = Dimensions.get('window').height;
      const endY = e.endCoordinates.screenY;
      setKeyboardOffset((screenHeight - endY) * 0.6);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Function to fetch the signed URL for the image
  const fetchSignedUrl = async () => {
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .createSignedUrl('landscaping-main.jpg', 60);
  
    if (error) {
      console.error('Error fetching signed URL:', error.message);
      return null;
    }
  
    return data.signedUrl;
  };

  return (
    <ScrollView 
      style={loginStyles.container} 
      contentContainerStyle={loginStyles.contentContainer} 
      keyboardShouldPersistTaps='handled'
    >      
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={loginStyles.headerImage} />
      ) : (
        <Text>Loading image...</Text>
      )}

      <View style={loginStyles.container2}>
        <Text style={loginStyles.title}>Register</Text>

        {/* Email Error/Success Message */}
        <Text style={loginStyles.placeholderTitle}>
          {emailErrors.email ? emailErrors.email : isEmailValid ? 'Email looks good!' : 'Enter your email address'}
        </Text>

        {/* Email Input */}
        <View style={loginStyles.inputWrapper}>
          <TextInput
            style={[loginStyles.input, { paddingLeft: 20 }]}
            placeholder="email@email.com"
            placeholderTextColor="#C1C1C1"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
          />
          <MaterialIcons name="email" size={24} color="white" style={loginStyles.emailIcon} />
        </View>

        {/* Company Error/Success Message */}
        <Text style={loginStyles.placeholderTitle}>
          {companyErrors.company ? companyErrors.company : 'Maximum 70 characters allowed'}
        </Text>

        <View style={loginStyles.inputWrapper}>
          <TextInput
            style={[loginStyles.input, { paddingLeft: 20 }]}
            placeholder="Company Name"
            placeholderTextColor="#C1C1C1"
            value={company}
            onChangeText={handleCompanyNameChange}
            autoCapitalize="none"
            maxLength={70}
          />
          <MaterialIcons name="business" size={24} color="white" style={loginStyles.emailIcon} />
        </View>

        {/* Password Error/Success Message */}
        <Text style={loginStyles.placeholderTitle}>
          {passwordErrors.length > 0 ? passwordErrors.join(' ') : 'Enter your password'}
        </Text>    

        {/* Password Input */}
        <View style={loginStyles.inputWrapper}>
          <TextInput
            style={[loginStyles.input, { paddingRight: 20 }]}
            placeholder="*******************"
            placeholderTextColor="#C1C1C1"
            secureTextEntry={!passwordVisibility}
            value={password}
            onChangeText={handlePasswordChange}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={loginStyles.eyeIcon}>
            <Entypo name={passwordVisibility ? "eye-with-line" : "eye"} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Error/Success Message */}
        <Text style={loginStyles.placeholderTitle}>
          {confirmPasswordErrors.confirmPassword ? confirmPasswordErrors.confirmPassword : 
          confirmPassword && password === confirmPassword ? 'Passwords match' : 'Confirm your password'}
        </Text>

        {/* Confirm Password Input element */}
        <View style={loginStyles.inputWrapper}>
          <TextInput
            style={loginStyles.input}
            placeholder="*******************"
            placeholderTextColor="#C1C1C1"
            secureTextEntry={!confirmPasswordVisibility}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={loginStyles.eyeIcon}>
            <Entypo name={confirmPasswordVisibility ? "eye-with-line" : "eye"} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity 
          style={[
            loginStyles.button,
            // Conditional style: Apply grey background when the button is disabled
            (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isCompanyNameValid || isRegistering) 
            ? { backgroundColor: 'grey' } 
            : { backgroundColor: '#007AFF' } // Re-apply the original color when enabled
          ]} 
          onPress={handleSignUp}
          disabled={!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isCompanyNameValid || isRegistering}
        >
          <Text style={loginStyles.buttonText}>
            {isRegistering ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>

        {/* Draws the horizontal divider and 'or' text */}
        <View style={loginStyles.dividerContainer}>
            <HorizontalDivider />
            <OrText />
            <HorizontalDivider />
        </View>

        <TouchableOpacity style={loginStyles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={loginStyles.buttonText}>Back to Login</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default RegistrationScreen;