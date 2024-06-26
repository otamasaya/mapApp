import { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
} from "react-native-vision-camera";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const device = useCameraDevice("back");
  // const cameraDevice = device.back;
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const [image, setImage] = useState("");

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

  console.log(cameraRef);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const onTakePicturePressed = async () => {
    // const camera = useRef < Camera > null;
    try {
      if (cameraRef.current == null) {
        console.log("^^");
      }
      const photo = await cameraRef.current.takePhoto();
      console.log(photo);
    } catch (error) {
      console.log(error.message);
    }
  };

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        photo={true}
        photoQualityBalance="speed"
        isActive={isActive}
      />
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
      ></Pressable>
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
      ></TouchableOpacity>
    </View>
  );
}
