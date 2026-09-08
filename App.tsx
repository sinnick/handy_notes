import { Geist_400Regular } from '@expo-google-fonts/geist/400Regular';
import { Geist_500Medium } from '@expo-google-fonts/geist/500Medium';
import { GeistMono_400Regular } from '@expo-google-fonts/geist-mono/400Regular';
import { GeistMono_500Medium } from '@expo-google-fonts/geist-mono/500Medium';
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
    Geist_400Regular,
    Geist_500Medium,
    GeistMono_400Regular,
    GeistMono_500Medium,
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
