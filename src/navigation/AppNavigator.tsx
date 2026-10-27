import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../constants/theme';
import { BookingConfirmationScreen } from '../views/BookingConfirmationScreen';
import { BookingScreen } from '../views/BookingScreen';
import { FieldDetailsScreen } from '../views/FieldDetailsScreen';
import { FieldsListScreen } from '../views/FieldsListScreen';
import { HomeScreen } from '../views/HomeScreen';
import { MyBookingsScreen } from '../views/MyBookingsScreen';
import { ProfileScreen } from '../views/ProfileScreen';
import { ReviewsScreen } from '../views/ReviewsScreen';
import { SearchFieldsScreen } from '../views/SearchFieldsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.primaryDark,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, statusBarStyle: 'light' }} />
        <Stack.Screen
          name="SearchFields"
          component={SearchFieldsScreen}
          options={{ title: 'Search fields', statusBarStyle: 'dark' }}
        />
        <Stack.Screen
          name="FieldsList"
          component={FieldsListScreen}
          options={{ title: 'Available fields', statusBarStyle: 'dark' }}
        />
        <Stack.Screen
          name="FieldDetails"
          component={FieldDetailsScreen}
          options={{ headerShown: false, statusBarStyle: 'light' }}
        />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book a field', statusBarStyle: 'dark' }} />
        <Stack.Screen
          name="BookingConfirmation"
          component={BookingConfirmationScreen}
          options={{ headerShown: false, statusBarStyle: 'dark', gestureEnabled: false }}
        />
        <Stack.Screen
          name="MyBookings"
          component={MyBookingsScreen}
          options={{ title: 'My bookings', statusBarStyle: 'dark' }}
        />
        <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: 'Reviews', statusBarStyle: 'dark' }} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false, statusBarStyle: 'light' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
