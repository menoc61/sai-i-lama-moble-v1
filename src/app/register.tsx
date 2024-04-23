import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

const Login = () => {
  const [name, setName] = useState('meno');
  const [email, setEmail] = useState('gillemomeni@gmail.com');
  const [password, setPassword] = useState('momeni@c61');
  const [phone, setPhone] = useState('699691121');
  const [gender, setGender] = useState('male');
  const [birthday, setBirthday] = useState('15-12-2003');
  const [address, setAddress] = useState('mimboman');
  const { onRegister } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    try {
      if (!onRegister) {
        throw new Error('onRegister function is not defined');
      }

      const userData = {
        name: name,
        email: email,
        password: password,
        phone: Number(phone),
        gender: gender,
        birthday: birthday,
        address: address,
      };

      const result = await onRegister(userData);
      if (result && result.error) {
        alert(result.msg);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://galaxies.dev/img/logos/logo--blue.png' }}
        style={styles.image}
      />

      <TextInput
        autoCapitalize="none"
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.inputField}
        placeholderTextColor={'#fff'}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.inputField}
        placeholderTextColor={'#fff'}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
        placeholderTextColor={'#fff'}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.inputField}
        placeholderTextColor={'#fff'}
      />
      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.inputField}
        placeholderTextColor={'#fff'}
      />
      <TextInput
        placeholder="Birthday"
        value={birthday}
        onChangeText={setBirthday}
        style={styles.inputField}
        placeholderTextColor={'#fff'}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.inputField}
        placeholderTextColor={'#fff'}
      />

      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={{ color: '#fff' }}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    padding: 10,
    color: '#fff',
    backgroundColor: Colors.input,
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 4,
  },
});

export default Login;
