import { useState } from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

export default function test() {
  const reference = storage();
  const params = useLocalSearchParams();
  const { imageUri, latitude, longitude, spotId } = params;
  const [spotName, setSpotName] = useState("");

  const uploadPhoto = async () => {
    // 写真をstorageに格納
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const imagePath =
      "photo/image-" + new Date().getTime().toString() + randomNumber;
    await reference.ref(imagePath).putFile(imageUri);

    // メイン画面の投稿であれば、現在地のスポットを追加
    if (spotId == 0) {
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
        name: spotName,
        areaRadius: 50,
      });
    }

    firestore()
      .collection("photo")
      .add({
        imagePath: imagePath,
        spotId: maxId,
        userId: 1,
      })
      .then()
      .catch((error) => console.log(error));

    // router.replace({ pathname: "../(main)/index.jsx" });
    router.replace("../(main)/index");
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
