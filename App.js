import React from 'react';
import Navbar from './screens/navbar/Navbar';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <Navbar />
    </NavigationContainer>
  )
};