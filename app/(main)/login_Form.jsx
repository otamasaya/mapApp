import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { useNavigation } from 'expo-router';;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder='email'
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder='Password'
      />
      <Button
        title="LOGIN"
        onPress={() => navigation.navigate('index')}
        style={styles.button}
      />

      <Text
      style={styles.label}
      
      onPress={() => navigation.navigate('index')}>Forgot password?</Text>
      
      <Text
      style={styles.label}>Dont't have an account?</Text>

      <Button
        title="SIGN UP"
        onPress={() => navigation.navigate('index')}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    margin: 10,
    fontSize: 20,
    height: 40,
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  label:{
    fontSize:16,
    paddingTop: 15,
    paddingBottom:15,
    textAlign: 'center'
  }
});

export default LoginScreen;