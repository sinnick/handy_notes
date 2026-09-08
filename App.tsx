import { DMMono_400Regular } from '@expo-google-fonts/dm-mono/400Regular';
import { DMMono_500Medium } from '@expo-google-fonts/dm-mono/500Medium';
import { Rubik_400Regular } from '@expo-google-fonts/rubik/400Regular';
import { Rubik_500Medium } from '@expo-google-fonts/rubik/500Medium';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { NotesProvider } from './src/store/NotesContext';
import { useTheme } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  return (
    <SafeAreaProvider>
      <Root ready={fontsLoaded} />
    </SafeAreaProvider>
  );
}

function Root({ ready }: { ready: boolean }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {ready && (
        <NotesProvider>
          <HomeScreen />
        </NotesProvider>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
