import { View, Text } from "react-native";

export default function test() {
  const params = useLocalSearchParams();
  const { imageUri } = params;

  return (
    <View>
      <Text>{imageUri}</Text>
    </View>
  );
}
