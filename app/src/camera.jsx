import { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image, // 修正: Image をインポート
} from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  PhotoFile,
} from "react-native-vision-camera";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { Button } from "react-native-web";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const [image, setImage] = useState(""); // 修正: 初期値を設定
  const [photo, setPhoto] = useState(null); // 修正: 型アノテーションを削除
  const [flash, setFlash] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log("on duty");
      setIsActive(true);
      return () => {
        console.log("navigating away");
        setIsActive(false);
      };
    }, [])
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const onTakePicturePressed = async () => {
    try {
      if (cameraRef.current == null) {
        console.log("null");
        return;
      }
      const photo = await cameraRef.current.takePhoto();
      console.log(photo);
      setPhoto(photo);
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) {
      return;
    }

    const result = await fetch(`file://${photo.path}`); // 修正: photo.path を使用
    const data = await result.blob();
    console.log(data);
  };

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        photo={true}
        photoQualityBalance="quality"
        isActive={isActive && !photo}
      />

      {photo ? (
        <>
          <FontAwesome5
            onPress={() => setPhoto(null)}
            name="arrow-left"
            size={25}
            color="red"
            style={{ position: "absolute", top: 50, left: 30 }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 50,
              backgroundColor: "rgba(0,0,0,0.40)",
            }}
          >
            <Button title="Upload" onPress={uploadPhoto} />
          </View>
          <Image
            source={{ uri: `file://${photo.path}` }}
            style={StyleSheet.absoluteFill}
          />{" "}
          {/* 修正: Image コンポーネントを使用 */}
        </>
      ) : (
        <>
          <Pressable
            onPress={onTakePicturePressed}
            style={{
              position: "absolute",
              alignSelf: "center",
              bottom: 50,
              width: 75,
              height: 75,
              backgroundColor: "white",
              borderRadius: 75,
            }}
          />
          <TouchableOpacity
            onPress={pickImage}
            style={{
              position: "absolute",
              alignSelf: "center",
              bottom: 50,
              left: 40,
              width: 45,
              height: 45,
              backgroundColor: "black",
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Pick</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
