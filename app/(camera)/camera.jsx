import { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { Stack, useFocusEffect, Link } from "expo-router";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  PhotoFile,
  useCameraFormat,
} from "react-native-vision-camera";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import storage from "@react-native-firebase/storage";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const [image, setImage] = useState("");
  const [photo, setPhoto] = useState(null);
  const reference = storage();
  //★
  // const format = useCameraFormat(device, [
  //   { photoAspectRatio: 3 / 4 },
  //   { photoResolution: { width: 960, height: 1280 } },
  // ]);
  //★
  const format = useCameraFormat(device, [
    { photoAspectRatio: 4 / 3 },
    { photoResolution: { width: 1280, height: 960 } },
  ]);

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
    console.log(photo.path);
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const imagePath =
      "photo/image-" + new Date().getTime().toString() + randomNumber;
    await reference.ref(imagePath).putFile(photo.path);
    console.log(imagePath);
  };

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      const imagePath =
        "photo/image-" + new Date().getTime().toString() + randomNumber;
      await reference.ref(imagePath).putFile(result.assets[0].uri);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera
        ref={cameraRef}
        style={styles.container}
        device={device}
        photo={true}
        format={format}
        isActive={isActive && !photo}
      />

      {photo && (
        <>
          <Image source={{ uri: photo.path }} style={StyleSheet.absoluteFill} />
          <FontAwesome5
            onPress={() => setPhoto(undefined)}
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
            <Link>
              <Pressable
                onPress={uploadPhoto}
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  bottom: 50,
                  width: 75,
                  height: 75,
                  backgroundColor: "red",
                  borderRadius: 75,
                }}
              />
            </Link>
            {/*
            <Button title="Upload" onPress={uploadPhoto} />
            */}
          </View>
        </>
      )}

      {!photo && (
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
          <Pressable
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
          />
        </>
      )}
    </View>
  );
}

// スタイル
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: "fixed",
    // maxWidth: "auto",
    // maxHeight: "auto",
    // top: 50,
    // bottom: 50,
  },
});
