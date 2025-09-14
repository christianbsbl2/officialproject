import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
};

const EMERGENCY_CONTACTS = [
  {
    title: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 crisis support',
  },
  {
    title: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free 24/7 crisis counseling',
  },
  {
    title: 'National Child Abuse Hotline',
    phone: '1-800-4-A-CHILD (1-800-422-4453)',
    description: '24/7 professional crisis counselors',
  },
];

export default function ResourcesScreen() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallPress = (phone: string) => {
    const phoneNumber = phone.replace(/[^\d]/g, '');
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleUrlPress = (url: string) => {
    Linking.openURL(url);
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Support Resources</Text>
        <Text style={[styles.subtitle, { color: theme.secondary }]}>
          Get help and support when you need it most
        </Text>
      </View>

      <View style={styles.emergencySection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Emergency Contacts</Text>
        <Text style={[styles.emergencyNote, { color: theme.error }]}>
          If you are in immediate danger, call 911
        </Text>
        
        {EMERGENCY_CONTACTS.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.emergencyCard, { backgroundColor: theme.card }]}
            onPress={() => handleCallPress(contact.phone)}
          >
            <View style={styles.emergencyContent}>
              <Text style={[styles.emergencyTitle, { color: theme.text }]}>
                {contact.title}
              </Text>
              <Text style={[styles.emergencyPhone, { color: theme.accent }]}>
                {contact.phone}
              </Text>
              <Text style={[styles.emergencyDescription, { color: theme.secondary }]}>
                {contact.description}
              </Text>
            </View>
            <IconSymbol name="phone.fill" size={24} color={theme.accent} />
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text style={[styles.loadingText, { color: theme.secondary }]}>Loading resources...</Text>
      ) : (
        Object.entries(groupedResources).map(([category, categoryResources]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {category}
            </Text>
            
            {categoryResources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={[styles.resourceCard, { backgroundColor: theme.card }]}
                onPress={() => handleUrlPress(resource.url)}
              >
                <View style={styles.resourceContent}>
                  <Text style={[styles.resourceTitle, { color: theme.text }]}>
                    {resource.title}
                  </Text>
                  <Text style={[styles.resourceDescription, { color: theme.secondary }]}>
                    {resource.description}
                  </Text>
                </View>
                <IconSymbol name="arrow.up.right" size={20} color={theme.accent} />
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}

      {!loading && Object.keys(groupedResources).length === 0 && (
        <View style={styles.emptyState}>
          <IconSymbol name="book.fill" size={48} color={theme.secondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Resources Coming Soon
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.secondary }]}>
            Your school will add helpful resources and support links here.
          </Text>
        </View>
      )}
    </ScrollView>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  emergencySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emergencyNote: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emergencyPhone: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 32,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});