import { View, Image, StyleSheet, Pressable,TextInput,Dimensions} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import React, { useState } from "react";

export default function test() {
  const [text, setText] = useState(""); // テキスト入力を保持するための状態
  const reference = storage();
  const params = useLocalSearchParams();
  const { imageUri, latitude, longitude } = params;


  //画像のサイズを固定
  const { width } = Dimensions.get("window");
  const imageWidth = width * 0.75; // 画面幅の75%
  const imageHeight = (imageWidth * 4) / 3; // 3:4のアスペクト比を維持



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

    // router.replace({ pathname: "../(main)/index.jsx" });
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: imageUri }}         
      style={{
          width: imageWidth,
          height: imageHeight,
          alignSelf: 'center',
          marginTop: 20,
        }} 
      />
      <TextInput
        style={{
          height: 60,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 5,
          marginVertical: 20,
          paddingHorizontal: 10,
          width: width * 0.75, // 画面幅の50%に設定
          marginLeft: 0, // 左寄せ
          marginTop: 25, // 上部の余白
        }}
        placeholder="テキストを入力"
        maxLength={30} // 文字数制限を30文字に設定
        onChangeText={setText}
        value={text}
      />
      <Pressable
        onPress={uploadPhoto}
        style={{
          position: "absolute",
          right: 20,
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
