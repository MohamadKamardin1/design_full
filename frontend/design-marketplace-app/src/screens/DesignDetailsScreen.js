import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function DesignDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesign();
  }, []);

  const fetchDesign = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    try {
      const response = await axios.get(`http://192.168.1.55:8000/api/designs/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDesign(response.data);
    } catch (error) {
      alert('Failed to load design details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!design) {
    return <Text>No Design Found.</Text>;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{design.title}</Text>
      <Image source={{ uri: design.image }} style={{ width: '100%', height: 200, marginVertical: 10 }} />
      <Text style={{ marginBottom: 10 }}>{design.description}</Text>
      <Text style={{ fontWeight: 'bold' }}>Features:</Text>
      <Text>{design.features}</Text>
      <Text style={{ marginVertical: 10, fontSize: 18 }}>Price: ${design.price}</Text>

      <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Designer:</Text>
      <Text>{design.designer.username}</Text>

      <Button title="Message Designer" onPress={() => navigation.navigate('Messages', { designId: id })} />
      <Button title="Book Design" onPress={() => navigation.navigate('Booking', { designId: id })} />
    </ScrollView>
  );
}
