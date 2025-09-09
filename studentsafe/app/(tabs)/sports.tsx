import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import UploadAnything from '@/components/UploadAnything';

type UploadItem = {
  type: 'text' | 'file';
  content?: string;
  name?: string;
};

export default function SportsTab() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const handleUpload = (item: any) => {
    // Normalize file uploads
    if (item.type === 'text') {
      setUploads((prev) => [{ type: 'text', content: item.content }, ...prev]);
    } else {
      setUploads((prev) => [{ type: 'file', name: item.name || 'File' }, ...prev]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <UploadAnything onUpload={handleUpload} />
      <FlatList
        data={uploads}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{ margin: 12, padding: 12, backgroundColor: '#23272F', borderRadius: 12 }}>
            {item.type === 'text' ? (
              <Text style={{ color: '#fff' }}>{item.content}</Text>
            ) : (
              <Text style={{ color: '#fff' }}>Uploaded: {item.name || 'File'}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#B0B3B8', textAlign: 'center', marginTop: 24 }}>No uploads yet. Be the first to share!</Text>}
      />
    </View>
  );
}
