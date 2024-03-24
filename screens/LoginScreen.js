// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text, TextInput, TouchableOpacity, Alert, Image, Keyboard, Dimensions } from 'react-native';
import styles from '../styles/loginStyles';
import { signInWithEmail } from '../services/authService';
import { emailValidator, simplePasswordValidator } from '../utils/validators';
import { Entypo } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HorizontalDivider = () => (
  <View style={styles.horizontalDivider} />
);

const OrText = ({ text = 'or' }) => (
  <Text style={styles.orText}>{text}</Text>
);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  
  // Function to handle the email change and validation
  const handleEmailChange = (text) => {
    setEmail(text);
    const validationResults = emailValidator({ email: text });
    setIsEmailValid(validationResults.isValid);
    setErrors(currentErrors => ({ ...currentErrors, email: validationResults.errors.email }));
  };

  // Function to handle the password change
  const handlePasswordChange = (text) => {
    setPassword(text);
    const validationResults = simplePasswordValidator(text);
    setErrors(currentErrors => ({ ...currentErrors, password: validationResults.errors.password }));
  };

  // Fetch the image URL on mount and set it to state
  useEffect(() => {
    (async () => {
      const signedUrl = await fetchSignedUrl();
      if (signedUrl) {
        setImageUrl(signedUrl);
      }
    })();
  }, []);

  // Keyboard listeners to adjust the screen when the keyboard is shown or hidden
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

  // Function to fetch a signed URL for the image on mount and set it to state
  const fetchSignedUrl = async () => {
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .createSignedUrl('landscaping-main.jpg', 60); // 60 seconds validity
  
    if (error) {
      return null;
    }
    return data.signedUrl;
  };

  const handleRegisterPress = () => {
    navigation.navigate('Registration', { isManager: true });
  };

  // Function to handle the sign in process with email and password
  const handleSignIn = async () => {
    let isValid = true;
    
    const emailErrors = emailValidator({ email });
    const passwordErrors = simplePasswordValidator(password);
    
    if (!emailErrors.isValid || !passwordErrors.isValid) {
      setErrors({ ...emailErrors.errors, ...passwordErrors.errors });
      isValid = false;
    }
  
    if (isValid) {
      try {
        const user = await signInWithEmail(email, password);
        if (user) {
        // Fetch user role
        const { data, error } = await supabase
          .from('profiles')
          .select('is_manager')
          .eq('id', user.id)
          .single();

          if (error) {
            throw new Error(error.message);
          }
        }
      } catch (error) {
        console.log("Error after catch: ", error);
      }
    }
  };

  // Function to toggle the password visibility on and off
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (     
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer} 
      keyboardShouldPersistTaps='handled'
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.headerImage}
        />
      ) : (
        <Text>Loading image...</Text>
      )}

      <View style={styles.container2}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.placeholderTitle}>
          {errors.email ? errors.email : isEmailValid ? 'Email looks good!' : 'Enter your email address'}
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { paddingLeft: 20 }]}
            placeholder="email@email.com"
            placeholderTextColor="#C1C1C1"
            value={email}
            onChangeText={handleEmailChange}
          />
          <MaterialIcons name="email" size={24} color="white" style={styles.emailIcon} />
        </View>

        <Text style={styles.placeholderTitle}>
          {errors.password ? errors.password : 'Enter your password'}
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { paddingRight: 20 }]}
            placeholder=" ******************"
            placeholderTextColor="#C1C1C1"
            secureTextEntry={!passwordVisibility}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Entypo name={passwordVisibility ? "eye-with-line" : "eye"} size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <HorizontalDivider />
          <OrText />
          <HorizontalDivider />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;