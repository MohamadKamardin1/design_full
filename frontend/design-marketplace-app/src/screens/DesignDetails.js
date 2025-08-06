import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

export default function DesignDetails({ navigation, route }) {
  const { id } = route.params;
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    fetchDesign();
  }, []);

  const fetchDesign = async () => {
    const token = '98a0a424bdd55b9e161b49caf07396703ba0faf3';
    const apiUrl = `http://192.168.1.55:8000/api/designs/${id}/`; // Use 10.0.2.2 for emulator

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Token ${token}` },
        timeout: 10000,
      });
      console.log('✅ Design response:', JSON.stringify(response.data, null, 2));
      setDesign(response.data);
    } catch (error) {
      console.error('❌ Fetch error:', error.toJSON ? error.toJSON() : error);
      console.error('💥 Axios error:', error.response?.status, error.response?.data);
      let errorMessage = 'Failed to load design details.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Unauthorized: Invalid or expired token.';
        } else if (error.response.status === 404) {
          errorMessage = 'Design not found.';
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

  const handleBook = () => {
    // Placeholder for booking logic
    alert('Booking functionality coming soon!');
    // Example: navigation.navigate('BookingScreen', { designId: id });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Animatable.View
          animation="rotate"
          iterationCount="infinite"
          style={styles.loaderContainer}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </Animatable.View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Animatable.View animation="fadeIn" style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              fetchDesign();
            }}
          >
            <LinearGradient
              colors={['#007AFF', '#00A1FF']}
              style={styles.retryButtonGradient}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View
          ref={cardRef}
          animation="fadeInUp"
          duration={1000}
          style={styles.designCard}
        >
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: design.designer?.profile_image || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.designerName}>{design.designer?.username || 'Unknown'}</Text>
              <Text style={styles.designerInfo}>
                {design.designer?.first_name} {design.designer?.last_name}
              </Text>
            </View>
          </View>
          <Image
            source={{ uri: design.image }}
            style={styles.designImage}
            resizeMode="cover"
            defaultSource={{ uri: 'https://via.placeholder.com/300' }}
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => {
                setLiked(!liked);
                cardRef.current.bounce(800);
              }}
            >
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={24}
                color={liked ? '#E1306C' : '#333'}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color="#333" style={styles.actionIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.designText}>
            <Text style={styles.designTitle}>{design.title || 'Untitled Design'}</Text>
            <Text style={styles.designPrice}>${design.price || 'N/A'}</Text>
            <Text style={styles.designDescription}>{design.description || 'No description available.'}</Text>
            <Text style={styles.designFeatures}>Features: {design.features || 'None'}</Text>
            <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
              <LinearGradient
                colors={['#007AFF', '#00A1FF']}
                style={styles.bookButtonGradient}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>
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
    padding: 10,
  },
  designCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  designerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  designerInfo: {
    fontSize: 14,
    color: '#666',
  },
  designImage: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 15,
  },
  designText: {
    padding: 15,
  },
  designTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  designPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  designDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  designFeatures: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  bookButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});