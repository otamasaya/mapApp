import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Dimensions, StyleSheet,Image,Modal,TouchableOpacity } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");   //デバイスの幅と高さを取得する
const ASPECT_RATIO = width / height;  //アスペクト比
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;  //地図の表示範囲

const TrackUserMapView = () => {
  const [position, setPosition] = useState({    //ユーザーの位置情報を保持
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
  });

  const [error, setError] = useState(null); //位置情報取得時に発生するエラーを管理する
  const [initialRegion, setInitialRegion] = useState(null); //地図の初期表示範囲を保持します。

  const [modalVisible, setModalVisible] = useState(false); // モーダルの表示状態を管理するステート

  const handleMarkerPress = () => {
    setModalVisible(true); // マーカーが押されたらモーダルを表示する
    
  };


  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  // 2点間の距離を計算する関数
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球の半径（単位: km）
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // 距離をメートルに変換するために1000を掛ける
    return distance;
  }

  useEffect(() => {   //リアルタイムでユーザーの位置情報を監視し、更新
    const watchId = Geolocation.watchPosition(
      (position) => {
        setPosition(position.coords);
        if (!initialRegion) {
          setInitialRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        } else {
          setError("Position or coords is undefined");
        }
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, distanceFilter: 1 }
    );
    return () => Geolocation.clearWatch(watchId);
  }, [initialRegion]);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {initialRegion && (
        <MapView
          key={`${initialRegion.latitude}-${initialRegion.longitude}`}
          style={StyleSheet.absoluteFillObject}
          region={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          >
            <View style={styles.radius}>
              <View style={styles.marker} />
            </View>
          </Marker>
          <Marker
            coordinate={{
              latitude: 34.69455,
              longitude: 135.19070,
            }}
            title="生田神社"
            description="生田神社だヨ"
          />
          <Marker
            coordinate={{
              latitude: 34.69891700747491,
              longitude: 135.19364647347652,
            }}
            title="神戸電子学生会館"
            description="ここでアプリは作られた。"
            onPress={handleMarkerPress} // マーカーが押されたときの処理
          >
            <Image
          source={require('./image/S__5201926.jpg')}
          style={styles.markerImage}
        />
            </Marker>
            <Marker
            coordinate={{
              latitude: 34.68916215229272,
              longitude: 135.19632682301685,
            }}
            title="東遊園地"
            description="冬にはルミナリエが開催されています。"
          >

          </Marker>
        
          {/* Debug 用に coords オブジェクトを表示
          <View style={styles.debugContainer}>
            <Text>{`coords: {`}</Text>
            {Object.keys(position).map(key => {
              return <Text key={key}>{`  ${key} : ${position[key]}`}</Text>;
            })}
            <Text>{`}`}</Text>
          </View> */}
        </MapView>
        
      )}

    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      ><View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text>マーカーがクリックされました!</Text>
        <Image 
        source={require('./image/S__5201926.jpg')}
        style={styles.markerImage}/>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>閉じる</Text>
        </TouchableOpacity>
      </View>
    </View></Modal>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  radius: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: "hidden",
    backgroundColor: "rgba(0, 112, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 112, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20 / 2,
    overflow: "hidden",
    backgroundColor: "#007AFF",
  },
  spot: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20 / 20,
    overflow: "hidden",
    backgroundColor: "#c71585",
  },
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  debugContainer: {
    backgroundColor: "#fff",
    opacity: 0.8,
    position: "absolute",
    bottom: 10,
    left: 10,
    padding: 10,
  },
  errorContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "red",
    padding: 10,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
  markerImage: {
    width: 50,
    height: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TrackUserMapView;
