import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

type Report = {
  id: string;
  title: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
};

export default function HomeScreen() {
  const { profile } = useAuth();
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id, title, status, created_at')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.warning;
      case 'reviewed': return theme.accent;
      case 'resolved': return theme.success;
      default: return theme.secondary;
    }
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Help',
      'If you are in immediate danger, please call 911 or your local emergency services.',
      [
        { text: 'Call 911', onPress: () => {/* In a real app, this would initiate a call */} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>
          Welcome back, {profile?.email?.split('@')[0]}
        </Text>
        <Text style={[styles.school, { color: theme.secondary }]}>
          {profile?.school}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.emergencyButton, { backgroundColor: theme.error }]}
        onPress={handleEmergency}
      >
        <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#FFFFFF" />
        <Text style={styles.emergencyText}>Emergency Help</Text>
      </TouchableOpacity>

      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.card }]}
            onPress={() => router.push('/(tabs)/report')}
          >
            <IconSymbol name="exclamationmark.triangle" size={32} color={theme.accent} />
            <Text style={[styles.actionTitle, { color: theme.text }]}>Report Incident</Text>
            <Text style={[styles.actionSubtitle, { color: theme.secondary }]}>
              Report bullying, harassment, or safety concerns
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.card }]}
            onPress={() => router.push('/(tabs)/resources')}
          >
            <IconSymbol name="book.fill" size={32} color={theme.accent} />
            <Text style={[styles.actionTitle, { color: theme.text }]}>Get Help</Text>
            <Text style={[styles.actionSubtitle, { color: theme.secondary }]}>
              Access support resources and helplines
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Reports</Text>
        
        {loading ? (
          <Text style={[styles.emptyText, { color: theme.secondary }]}>Loading...</Text>
        ) : recentReports.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.secondary }]}>
            No reports yet. Your safety reports will appear here.
          </Text>
        ) : (
          recentReports.map((report) => (
            <View key={report.id} style={[styles.reportCard, { backgroundColor: theme.card }]}>
              <View style={styles.reportHeader}>
                <Text style={[styles.reportTitle, { color: theme.text }]} numberOfLines={1}>
                  {report.title}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                  <Text style={styles.statusText}>{report.status}</Text>
                </View>
              </View>
              <Text style={[styles.reportDate, { color: theme.secondary }]}>
                {new Date(report.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </View>
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
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  school: {
    fontSize: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  recentSection: {
    marginBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  reportCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  reportDate: {
    fontSize: 14,
  },
});