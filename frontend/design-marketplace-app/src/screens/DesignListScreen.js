import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function DesignListScreen({ navigation }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    const token = '98a0a424bdd55b9e161b49caf07396703ba0faf3';
    // Use 10.0.2.2 for Android emulator, 192.168.1.55 for physical device
    const apiUrl = 'http://192.168.1.55:8000/api/designs/'; // Change to 192.168.1.55 if on physical device

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
        timeout: 10000,
      });

      console.log("✅ Full response:", JSON.stringify(response.data, null, 2));
      const data = response.data.results || response.data;
      if (!data || data.length === 0) {
        setError('No designs found.');
      } else {
        setDesigns(data);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error.toJSON ? error.toJSON() : error);
      console.error("💥 Axios error:", error.response?.status, error.response?.data);
      let errorMessage = 'Failed to load designs. Please try again.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Unauthorized: Invalid or expired token.';
        } else if (error.response.status === 404) {
          errorMessage = 'API endpoint not found. Check server URL.';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Check your network or server.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Ensure the server is reachable.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="zoomIn"
      delay={index * 150}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          console.log("Navigating to DesignDetails with ID:", item.id);
          navigation.navigate('DesignDetails', { id: item.id });
        }}
        onPressIn={() => {
          this[`card${item.id}`].rubberBand(800);
        }}
      >
        <Animatable.View
          ref={(ref) => (this[`card${item.id}`] = ref)}
          style={styles.card}
        >
          <LinearGradient
            colors={['#FFF', '#E9D5FF']}
            style={styles.cardGradient}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
                defaultSource={{ uri: 'https://via.placeholder.com/150' }}
                onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                style={styles.imageOverlay}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {item.title || 'Untitled Design'}
              </Text>
              <Text style={styles.price}>${item.price || 'N/A'}</Text>
            </View>
          </LinearGradient>
        </Animatable.View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <LinearGradient
      colors={['#7F00FF', '#E100FF', '#E9D5FF']}
      style={styles.container}
    >
      <Animatable.Text
        ref={headerRef}
        animation="bounceInDown"
        duration={1000}
        style={styles.header}
      >
        Design Gallery
      </Animatable.Text>
      {loading ? (
        <Animatable.View
          animation="fadeIn"
          iterationCount="infinite"
          style={styles.loaderContainer}
        >
          <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
        </Animatable.View>
      ) : error ? (
        <Animatable.View animation="fadeIn" style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              fetchDesigns();
            }}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.retryButtonGradient}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      ) : designs.length === 0 ? (
        <Animatable.View animation="fadeIn" style={styles.errorContainer}>
          <Text style={styles.errorText}>No designs available.</Text>
        </Animatable.View>
      ) : (
        <FlatList
          data={designs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 35,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  list: {
    paddingBottom: 30,
  },
  cardContainer: {
    width: screenWidth / 2 - 20,
    margin: 5,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  cardGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  info: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFD700',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 30,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FFF',
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