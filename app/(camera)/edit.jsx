import { View, Image, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

export default function test() {
  const reference = storage();
  const params = useLocalSearchParams();
  const { imageUri, latitude, longitude } = params;

  const uploadPhoto = async () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const imagePath =
      "photo/image-" + new Date().getTime().toString() + randomNumber;
    await reference.ref(imagePath).putFile(imageUri);

    const querySnapshot = await firestore()
      .collection("spot")
      .orderBy("id", "desc")
      .limit(1)
      .get();

    const maxId = querySnapshot.docs[0].data().id + 1;

    firestore().collection("spot").add({
      id: maxId,
      mapLatitude: latitude,
      mapLongitude: longitude,
      name: "Home",
    });

    firestore()
      .collection("photo")
      .add({
        imagePath: imagePath,
        spotId: maxId,
      })
      .then()
      .catch((error) => console.log(error));
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
