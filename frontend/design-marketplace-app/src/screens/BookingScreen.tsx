import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// Define the type for the navigation stack params
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  DesignDetails: { id: number };
  BookingScreen: { designId: number };
};

// Define props type for BookingScreen
type BookingScreenProps = NativeStackScreenProps<RootStackParamList, 'BookingScreen'>;

export default function BookingScreen({ route, navigation }: BookingScreenProps) {
  const { designId } = route.params || { designId: 0 };
  const [bookingDate, setBookingDate] = useState('');
  const [negotiatedPrice, setNegotiatedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleConfirmBooking = async () => {
    if (!bookingDate) {
      setError('Please enter a booking date.');
      return;
    }
    if (negotiatedPrice && isNaN(parseFloat(negotiatedPrice))) {
      setError('Negotiated price must be a valid number.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = '98a0a424bdd55b9e161b49caf07396703ba0faf3';
    const apiUrl = 'http://192.168.1.55:8000/api/bookings/'; // Adjust for emulator: http://10.0.2.2:8000

    try {
      const response = await axios.post(
        apiUrl,
        {
          design: designId,
          booking_date: bookingDate || null,
          negotiated_price: negotiatedPrice ? parseFloat(negotiatedPrice) : null,
          notes: notes || '',
        },
        {
          headers: { Authorization: `Token ${token}` },
          timeout: 10000,
        }
      );
      console.log('✅ Booking response:', JSON.stringify(response.data, null, 2));
      setSuccess('Booking confirmed successfully!');
      setTimeout(() => navigation.navigate('Home'), 2000);
    } catch (error) {
      console.error('❌ Booking error:', error.toJSON ? error.toJSON() : error);
      console.error('💥 Axios error:', error.response?.status, error.response?.data);
      let errorMessage = 'Failed to confirm booking.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Unauthorized: Invalid or expired token.';
        } else if (error.response.status === 404) {
          errorMessage = 'Booking endpoint not found.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid booking data.';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Ensure the server is reachable.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.Text
          animation="slideInDown"
          duration={1000}
          style={styles.header}
        >
          Book Design
        </Animatable.Text>
        <Text style={styles.infoText}>Booking for Design ID: {designId}</Text>
        {success && (
          <Animatable.View animation="fadeIn" style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.icon} />
            <Text style={styles.successText}>{success}</Text>
          </Animatable.View>
        )}
        {error && (
          <Animatable.View animation="fadeIn" style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#D32F2F" style={styles.icon} />
            <Text style={styles.errorText}>{error}</Text>
          </Animatable.View>
        )}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Booking Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2025-08-10"
            placeholderTextColor="#666"
            value={bookingDate}
            onChangeText={setBookingDate}
          />
          <Text style={styles.label}>Negotiated Price (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 200.00"
            placeholderTextColor="#666"
            value={negotiatedPrice}
            onChangeText={setNegotiatedPrice}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any specific requirements?"
            placeholderTextColor="#666"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleConfirmBooking}
            disabled={loading}
          >
            <LinearGradient
              colors={['#007AFF', '#00A1FF']}
              style={styles.bookButtonGradient}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.bookButtonText}>Confirm Booking</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  bookButton: {
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 20,
  },
  bookButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    color: '#4CAF50',
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
});