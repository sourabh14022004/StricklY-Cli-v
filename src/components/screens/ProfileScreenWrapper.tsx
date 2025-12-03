import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileStackNavigator from '../../navigation/ProfileStack';

const ProfileScreenWrapper: React.FC = () => {
  return (
    <View style={styles.container}>
      <ProfileStackNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileScreenWrapper;

