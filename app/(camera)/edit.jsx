import { View, Image, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import storage from "@react-native-firebase/storage";

export default function test() {
  const reference = storage();
  const params = useLocalSearchParams();
  const { imageUri } = params;

  const uploadPhoto = async () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const imagePath =
      "photo/image-" + new Date().getTime().toString() + randomNumber;
    await reference.ref(imagePath).putFile(imageUri);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} />
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
    </View>
  );
}
