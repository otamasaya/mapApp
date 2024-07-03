import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Dimensions, StyleSheet,Image, ImageBackground } from "react-native";

import Geolocation from "@react-native-community/geolocation";
import MapView, { Callout, Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TrackUserMapView = () => {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
  });

  const [error, setError] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        setPosition(position.coords);
        if (!initialRegion) {
          setInitialRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        } else {
          setError("Position or coords is undefined");
        }
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, distanceFilter: 1 }
    );
    return () => Geolocation.clearWatch(watchId);
  }, [initialRegion]);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {initialRegion && (
        <MapView
          key={`${initialRegion.latitude}-${initialRegion.longitude}`}
          style={StyleSheet.absoluteFillObject}
          customMapStyle={customMapStyle}
          region={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >

          <Marker
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          >
            <View style={styles.radius}>
              <View style={styles.marker} />
            </View>
          </Marker>


          <Marker
            coordinate={{
              latitude: 34.69455,
              longitude: 135.19070,
            }}
            title="Ikuta Shrine"
            description="0.6km"
            >
            <Image
          source={require('./image/pin_blue.png')}
          style={styles.markerImage}
        />
        </Marker>


          <Marker
            coordinate={{
              latitude: 34.69891700747491,
              longitude: 135.19364647347652,
            }}
            title="神戸電子学生会館"
            description="ここでアプリは作られた。"
          >
            <Image
          source={require('./image/pin_orange.png')}
          style={styles.markerImage}
        />
            </Marker>

          
            <Marker
            coordinate={{
              latitude: 34.687316813281704,
              longitude: 135.19256090993977,
            }}
            title="旧外国人居留地"
            description="ここでアプリは作られていない"
          >
            <Image
          source={require('./image/pin_green.png')}
          style={styles.markerImage}
        />
            </Marker>
        
          {/* Debug 用に coords オブジェクトを表示
          <View style={styles.debugContainer}>
            <Text>{`coords: {`}</Text>
            {Object.keys(position).map(key => {
              return <Text key={key}>{`  ${key} : ${position[key]}`}</Text>;
            })}
            <Text>{`}`}</Text>
          </View> */}
        </MapView>
      )}
    </SafeAreaView>
  );
};

const customMapStyle = [  
{
  "featureType": "poi.business",// ビジネス（ビル、店舗など）のラベルを非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi.business",// ビジネス（ビル、店舗など）のアイコンを非表示
  "elementType": "labels.icon",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi.attraction", // 観光スポットのラベルを非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi.government", // 政府機関のラベルを非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi.medical", // 医療施設のラベルを非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi.park", // 公園のラベルを非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi.place_of_worship", // 宗教施設のラベルを非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi.school", // 学校のラベルを非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi.sports_complex", // スポーツ施設のラベルを非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "road", // 道路の号線表示を非表示
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},{
  "featureType": "administrative.locality", // 町、村、区のラベルを非表示
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "administrative.locality", // 町、村、区のラベルのアウトラインを非表示
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "administrative.neighborhood", // 住所（丁目）のラベルを非表示
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "administrative.neighborhood",    // 住所（丁目）のラベルのアウトラインを非表示
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},

//ここから地図の色
  {
    "featureType": "landscape.natural",// 自然地形の色
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#33aa33" 
      }
    ]
  },
{
  "featureType": "landscape.man_made",  //地面の色
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#e0ffe0" 
    }
  ]
},
{
    "featureType": "road",  //  一般道の色
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#404040"
      }
    ]
  },
  {
    "featureType": "road",  // 一般道の枠線
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#f0f0f0",
        "weight": 1
      }
    ]
  },
  {
    "featureType": "road.highway",// 高速道路の色
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#808080"
      }
    ]
  },
  {
    "featureType": "road.highway",// 高速道路の枠線の色
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#fcfcfc",
        "weight": 1
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#5375cd"  // 水の色を青色に変更
      }
    ]
  },
  {
    
    "featureType": "poi.park",// 公園の色
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#99dd66"
      }
    ]
  },
  {
    "featureType": "transit.line",// 鉄道の色
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#11bbFF"  
      }
    ]
  },
  {
    "featureType": "transit.line",// 鉄道の枠線の太さ
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#ffffff" , 
        "weight": 1  
      },

    ]
  },
  {
    "featureType": "poi.school",// 教育機関の色
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffeecc"
      }
    ]
  },{
    // 医療機関の背景色を指定（例: 薄いピンク色）
    "featureType": "poi.medical",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffdddd"
      }
    ]
  },
];


const styles = StyleSheet.create({

  absoluteFillObject:{
    flex:1
  },

  radius: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: "hidden",
    backgroundColor: "rgba(0, 112, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 112, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20 / 2,
    overflow: "hidden",
    backgroundColor: "#007AFF",
  },
  spot: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20 / 20,
    overflow: "hidden",
    backgroundColor: "#c71585",
  },
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 50,
    height: 50,
  },
  debugContainer: {
    backgroundColor: "#fff",
    opacity: 0.8,
    position: "absolute",
    bottom: 10,
    left: 10,
    padding: 10,
  },
  errorContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "red",
    padding: 10,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default TrackUserMapView;