import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const PlaceMarker = React.memo(
  ({ latitude, longitude, title }: any) => (
    <Marker
      coordinate={{ latitude, longitude }}
      title={title}
      pinColor="red"
    />
  )
);

//mit Koordinaten, wandelt sie in Numbers
export default function Karte() {
  const { lat, lon, title } = useLocalSearchParams();

  const latitude = Number(Array.isArray(lat) ? lat[0] : lat); //genau einen Wert, um Array gut erkennen zu können
  const longitude = Number(Array.isArray(lon) ? lon[0] : lon); 
  const placeTitle = Array.isArray(title) ? title[0] : title;

  //Vor Absturz falls keine Koordinaten
  if (isNaN(latitude) || isNaN(longitude)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Fehler: Ungültige Koordinaten erhalten.</Text> 
      </View>
    );
  }

//Reinzoomen
  const mapRef = useRef<MapView | null>(null);
  useFocusEffect(
    useCallback(() => {
      if (mapRef.current) {
        mapRef.current.animateCamera(
          {
            center: { latitude, longitude },
            zoom: 16,
          },
          { duration: 800 }
        );
      }
    }, [latitude, longitude])
  );

  // ----------------------------------------------------------------
  // UI 
  // ------------------------------------------------------------------

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Zurück</Text>
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        moveOnMarkerPress={false}
        loadingEnabled={true}
        toolbarEnabled={false}
      >
        <PlaceMarker
          latitude={latitude}
          longitude={longitude}
          title={placeTitle}
        />
      </MapView>
    </View>
  );
}

// -------------------------------------------------------------
// STYLE
// -------------------------------------------------------------

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    zIndex: 10,
    top: 50,
    left: 20,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

