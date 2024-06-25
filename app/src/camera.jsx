import { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Stack, useFocusEffect } from "expo-router";

import {
  useCameraPermission,
  useCameraDevice,
  Camera,
} from "react-native-vision-camera";
import { ActivityIndicator } from "react-native-web";

const CameraScreen = () => {
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);

  const camera = useRef < Camera > null;

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
    const photo = await camera.current?.takePhoto();
    console.log(photo);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Camera
        useRef={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
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
      />
    </View>
  );
};

export default CameraScreen;
