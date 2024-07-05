import React, { useState, useEffect } from 'react';
import { Modal, View, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const MyModal = ({ visible, imageUri, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20 }}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchImageUri = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('photo')
        .where('spotId', '==', 1) // 特定の条件を指定
        .get();

      if (!querySnapshot.empty) {
        const documentSnapshot = querySnapshot.docs[0]; // 最初のドキュメントを取得
        const data = documentSnapshot.data();
        console.log('Document data:', data);

        if (data.imagePath) {
          const url = await storage()
            .ref(data.imagePath)
            .getDownloadURL();
          setImageUri(url);
        } else {
          console.log('No imagePath field in document');
        }
      } else {
        console.log('No documents found with the specified condition');
      }
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageUri();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>Show Popup</Text>
      </TouchableOpacity>
      <MyModal visible={modalVisible} imageUri={imageUri} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default App;
