import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/DashboardScreen';
import TasksScreen from './src/screens/TasksScreen';
import DailyRoutinesScreen from './src/screens/DailyRoutinesScreen';
import MedicationsScreen from './src/screens/MedicationsScreen';
import MedicationsListScreen from './src/screens/MedicationsListScreen';
import SupplementsListScreen from './src/screens/SupplementsListScreen';
import AppointmentsListScreen from './src/screens/AppointmentsListScreen';
import NotesScreen from './src/screens/NotesScreen';
import BooksScreen from './src/screens/BooksScreen';
import NutritionScreen from './src/screens/NutritionScreen';
import MistakesScreen from './src/screens/MistakesScreen';
import PrayerScreen from './src/screens/PrayerScreen';
import ShoppingScreen from './src/screens/ShoppingScreen';
import SpecialDaysScreen from './src/screens/SpecialDaysScreen';
import PomodoroScreen from './src/screens/PomodoroScreen';
import ModuleManagementScreen from './src/screens/ModuleManagementScreen';



export type RootStackParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  DailyRoutines: undefined;
  Medications: undefined;
  MedicationsList: undefined;
  SupplementsList: undefined;
  AppointmentsList: undefined;
  Notes: undefined;
  Books: undefined;
  Nutrition: undefined;
  Mistakes: undefined;
  Prayer: undefined;
  Shopping: undefined;
  SpecialDays: undefined;
  ModuleManagement: undefined;
  Pomodoro: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="DailyRoutines" component={DailyRoutinesScreen} />
          <Stack.Screen name="Medications" component={MedicationsScreen} />
          <Stack.Screen name="MedicationsList" component={MedicationsListScreen} />
          <Stack.Screen name="SupplementsList" component={SupplementsListScreen} />
          <Stack.Screen name="AppointmentsList" component={AppointmentsListScreen} />
          <Stack.Screen name="Notes" component={NotesScreen} />
          <Stack.Screen name="Books" component={BooksScreen} />
          <Stack.Screen name="Nutrition" component={NutritionScreen} />
          <Stack.Screen name="Mistakes" component={MistakesScreen} />
          <Stack.Screen name="Prayer" component={PrayerScreen} />
          <Stack.Screen name="Shopping" component={ShoppingScreen} />
                  <Stack.Screen name="SpecialDays" component={SpecialDaysScreen} />
        <Stack.Screen name="Pomodoro" component={PomodoroScreen} />
        <Stack.Screen name="ModuleManagement" component={ModuleManagementScreen} />

        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
