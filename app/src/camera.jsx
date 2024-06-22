import { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Stack, useFocusEffect } from "expo-router";

import {
  useCameraPermission,
  useCameraDevice,
  Camera,
} from "react-native-vision-camera";

const CameraScreen = () => {
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const onTakePicturePressed = () => {};

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
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
      />
    </View>
  );
};

export default CameraScreen;
