import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
          <Text style={styles.avatarText}>
            {profile?.email?.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <Text style={[styles.email, { color: theme.text }]}>
          {profile?.email}
        </Text>
        <Text style={[styles.school, { color: theme.secondary }]}>
          {profile?.school}
        </Text>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <IconSymbol name="bell.fill" size={24} color={theme.icon} />
          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Notifications</Text>
            <Text style={[styles.menuSubtitle, { color: theme.secondary }]}>
              Manage your notification preferences
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={theme.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <IconSymbol name="shield.fill" size={24} color={theme.icon} />
          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Privacy & Safety</Text>
            <Text style={[styles.menuSubtitle, { color: theme.secondary }]}>
              Review privacy settings and safety features
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={theme.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <IconSymbol name="questionmark.circle.fill" size={24} color={theme.icon} />
          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Help & Support</Text>
            <Text style={[styles.menuSubtitle, { color: theme.secondary }]}>
              Get help using the app
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={theme.secondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.error }]}
        onPress={handleSignOut}
      >
        <IconSymbol name="arrow.right.square.fill" size={24} color="#FFFFFF" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.secondary }]}>
          StudentSafe v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: theme.secondary }]}>
          Your safety is our priority
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  school: {
    fontSize: 16,
  },
  menuSection: {
    gap: 12,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 32,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
  },
});