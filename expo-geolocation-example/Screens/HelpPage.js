import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { fetchHighwayData } from '../database/DatabaseHelper';

const HelpPage = ({ route }) => {
  const { highwayNumber } = route.params;
  const [loading, setLoading] = useState(true);
  const [highwayData, setHighwayData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchHighwayData(highwayNumber);
      setHighwayData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching highway data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!highwayData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No data found for highway number {highwayNumber}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Highway Number: {highwayData.highwayNumber}
      </Text>
      <Text>Highway Name: {highwayData.highwayName}</Text>
      <Text>Crane Number: {highwayData.craneNumber}</Text>
      {/* Display other relevant data */}
    </View>
  );
};

export default HelpPage;
