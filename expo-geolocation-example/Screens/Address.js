import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, Linking, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { setupDatabase } from '../database/db';
import { insertHighwaysData } from '../database/highwayData';

const Address = ({ navigation }) => {
  const [highwayNumber, setHighwayNumber] = useState('');

  useEffect(() => {
    setupDatabase(); // Create database table if not exists
    insertHighwaysData(); // Insert multiple highway data
  }, []);

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'Wait, we are fetching you location...'
  );
  const [nearbyRoads, setNearbyRoads] = useState([]);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'Location Service not enabled',
        'Please enable your location services to continue',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
    let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

    if (coords) {
      const { latitude, longitude } = coords;
      setInitialRegion({ ...initialRegion, latitude, longitude });

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      for (let item of response) {
        let address =
          `${item.formattedAddress}`;

        setDisplayCurrentAddress(address);
      }
      fetchNearbyRoads(latitude, longitude);
    }
  };

  const fetchNearbyRoads = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=route&key=AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU&libraries=places`
      );
      const data = await response.json();


      if (data.results.length > 0) {
        const roads = data.results.map(result => result.name);
        setNearbyRoads(roads);
      }
    } catch (error) {
      console.error('Error fetching nearby roads:', error);
    }
  };

  const openAddressOnMap = () => {
    const addressURI = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayCurrentAddress)}`;
    Linking.openURL(addressURI);
  };

  const handleGetHelp = () => {
    // Navigate to new screen and pass highway number as parameter
    navigation.navigate('HelpPage', { highwayNumber });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={require('../assets/geo.png')} style={styles.image} />
        <Text style={styles.title}>What's your address?</Text>
        <Text style={styles.text}>{displayCurrentAddress}</Text>
        {nearbyRoads.length > 0 && (
          <View style={styles.nearbyRoadsContainer}>
            <Text style={styles.nearbyRoadsTitle}>Nearby Roads:</Text>
            {nearbyRoads.map((road, index) => (
              <Text key={index} style={styles.nearbyRoad}>{road}</Text>
            ))}
          </View>
        )}
      </View>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude
          }}
          title={displayCurrentAddress}
        />
      </MapView>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter Highway Number"
          placeholderTextColor="#ccc"
          value={highwayNumber}
          onChangeText={setHighwayNumber}
        />
        <Button title="Get Help" onPress={handleGetHelp} />
      </View>

      <TouchableOpacity style={styles.button} onPress={openAddressOnMap}>
        <Text style={styles.buttonText}>Open on Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707',
    alignItems: 'center',
    paddingTop: 90
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FD0139'
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff'
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#fff', 
  },
  nearbyRoadsContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  nearbyRoadsTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#fff'
  },
  nearbyRoad: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff'
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#FD0139',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default Address;