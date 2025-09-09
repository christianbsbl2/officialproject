
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../constants/Colors';

type UploadAnythingProps = {
  onUpload?: (item: any) => void;
};

type SelectedFile = {
  name?: string;
  mimeType?: string;
  uri?: string;
};

export default function UploadAnything({ onUpload }: UploadAnythingProps) {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [textPost, setTextPost] = useState('');

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setSelectedFile({
        name: file.name,
        mimeType: file.mimeType,
        uri: file.uri,
      });
      if (onUpload) onUpload({
        type: 'file',
        name: file.name,
        mimeType: file.mimeType,
        uri: file.uri,
      });
    }
  };

  const handleTextUpload = () => {
    if (textPost.trim() && onUpload) {
      onUpload({ type: 'text', content: textPost });
      setTextPost('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share something</Text>
      <TouchableOpacity style={styles.button} onPress={handleFilePick}>
        <Text style={styles.buttonText}>Upload File (image, video, doc, etc.)</Text>
      </TouchableOpacity>
      {selectedFile && (
        <View style={styles.preview}>
          <Text style={styles.previewText}>Selected: {selectedFile.name}</Text>
          {selectedFile.mimeType && selectedFile.mimeType.startsWith('image') && selectedFile.uri && (
            <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
          )}
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Or write a tip/post..."
        placeholderTextColor={Colors.dark.secondary}
        value={textPost}
        onChangeText={setTextPost}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleTextUpload}>
        <Text style={styles.buttonText}>Post Text</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: Colors.dark.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.dark.accent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: Colors.dark.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    minHeight: 40,
    borderWidth: 1,
    borderColor: Colors.dark.secondary,
  },
  preview: {
    marginVertical: 8,
    alignItems: 'center',
  },
  previewText: {
    color: Colors.dark.secondary,
    marginBottom: 4,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginTop: 4,
  },
});
