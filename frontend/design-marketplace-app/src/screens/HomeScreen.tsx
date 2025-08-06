import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the type for the navigation stack params
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  DesignDetails: { id: number };
  BookingScreen: { designId: number };
};

// Define the type for a Design object
interface Design {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  designer: {
    username: string;
    profile_image: string;
  };
}

// Define props type for HomeScreen
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const headerRef = useRef<Animatable.View & View>(null);
  const searchRef = useRef<Animatable.View & View>(null);
  // Store card refs for animations
  const cardRefs = useRef<Record<number, Animatable.View & View>>({});

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    const token = '98a0a424bdd55b9e161b49caf07396703ba0faf3';
    const apiUrl = 'http://192.168.1.55:8000/api/designs/'; // Use http://10.0.2.2:8000 for Android emulator

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Token ${token}` },
        timeout: 10000,
      });
      console.log('✅ Full response:', JSON.stringify(response.data, null, 2));
      const data = response.data.results || response.data;
      if (!data || data.length === 0) {
        setError('No designs found.');
      } else {
        setDesigns(data);
      }
    } catch (error: any) {
      console.error('❌ Fetch error:', error.toJSON ? error.toJSON() : error);
      console.error('💥 Axios error:', error.response?.status, error.response?.data);
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

  const toggleLike = (id: number) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (cardRefs.current[id]) {
      cardRefs.current[id].bounce(800);
    }
  };

  const filteredDesigns = designs.filter((d: Design) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <>
      <Animatable.Text
        ref={headerRef}
        animation="slideInDown"
        duration={1000}
        style={styles.header}
      >
        DesignSphere
      </Animatable.Text>
      <Animatable.View
        ref={searchRef}
        animation="pulse"
        easing="ease-in-out"
        style={styles.searchContainer}
      >
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search designs..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animatable.View>
    </>
  );

  const renderDesign = ({ item, index }: { item: Design; index: number }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      style={styles.designCardContainer}
    >
      <Animatable.View
        ref={(ref) => {
          if (ref) cardRefs.current[item.id] = ref;
        }}
        style={styles.designCard}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log('Navigating to DesignDetails with ID:', item.id);
            navigation.navigate('DesignDetails', { id: item.id });
          }}
          style={styles.headerContainer}
        >
          <Image
            source={{ uri: item.designer?.profile_image || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <Text style={styles.designerName}>{item.designer?.username || 'Unknown'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log('Navigating to DesignDetails with ID:', item.id);
            navigation.navigate('DesignDetails', { id: item.id });
          }}
          style={styles.imageContainer}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.designImage}
            resizeMode="cover"
            defaultSource={{ uri: 'https://via.placeholder.com/300' }}
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
        </TouchableOpacity>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={() => toggleLike(item.id)}
          >
            <Animatable.View ref={(ref) => {
              if (ref) cardRefs.current[item.id] = ref;
            }}>
              <Ionicons
                name={liked[item.id] ? 'heart' : 'heart-outline'}
                size={24}
                color={liked[item.id] ? '#E1306C' : '#333'}
              />
            </Animatable.View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="#333" style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log('Navigating to BookingScreen with designId:', item.id);
            navigation.navigate('BookingScreen', { designId: item.id });
          }}
          style={styles.designText}
        >
          <Text style={styles.designTitle}>{item.title || 'Untitled Design'}</Text>
          <Text style={styles.designPrice}>${item.price || 'N/A'}</Text>
          <Text style={styles.designDescription} numberOfLines={3} ellipsizeMode="tail">
            {item.description.replace(/\r\n/g, ' ') || 'No description available.'}
          </Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              console.log('Navigating to BookingScreen with designId:', item.id);
              navigation.navigate('BookingScreen', { designId: item.id });
            }}
          >
            <LinearGradient
              colors={['#007AFF', '#00A1FF']}
              style={styles.bookButtonGradient}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Animatable.View
          animation="rotate"
          iterationCount="infinite"
          style={styles.loaderContainer}
        >
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
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
              colors={['#007AFF', '#00A1FF']}
              style={styles.retryButtonGradient}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      ) : filteredDesigns.length === 0 ? (
        <Animatable.View animation="fadeIn" style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {searchQuery ? 'No designs match your search.' : 'No designs available.'}
          </Text>
        </Animatable.View>
      ) : (
        <FlatList
          data={filteredDesigns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDesign}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 15,
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginHorizontal: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  designCardContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  designerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  imageContainer: {
    position: 'relative',
  },
  designImage: {
    width: width - 20,
    height: width - 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 15,
  },
  designText: {
    padding: 15,
  },
  designTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  designPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  designDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  bookButton: {
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  bookButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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