import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: Colors.dark.background, light: Colors.light.background }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={[styles.titleContainer, { backgroundColor: theme.background }] }>
        <ThemedText type="title" style={{ color: theme.text }}>Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={[styles.stepContainer, { backgroundColor: theme.card }] }>
        <ThemedText type="subtitle" style={{ color: theme.accent }}>Step 1: Try it</ThemedText>
        <ThemedText style={{ color: theme.text }}>
          Edit <ThemedText type="defaultSemiBold" style={{ color: theme.accent }}>app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold" style={{ color: theme.accent }}>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={[styles.stepContainer, { backgroundColor: theme.card }] }>
        <ThemedText type="subtitle" style={{ color: theme.accent }}>Step 2: Explore</ThemedText>
        <ThemedText style={{ color: theme.text }}>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={[styles.stepContainer, { backgroundColor: theme.card }] }>
        <ThemedText type="subtitle" style={{ color: theme.accent }}>Step 3: Get a fresh start</ThemedText>
        <ThemedText style={{ color: theme.text }}>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold" style={{ color: theme.accent }}>npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold" style={{ color: theme.accent }}>app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold" style={{ color: theme.accent }}>app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold" style={{ color: theme.accent }}>app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
