import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { loadApiResponse, saveApiResponse } from '../../Speicher/apiCache';

// -------------------------------------------------------------
// Overpass: UI Transformation, legt fest was es braucht
// -------------------------------------------------------------

function transformOverpassElement(el: any) {
  const tags = el.tags ?? {};

  const name = tags.name?.trim();
  if (!name) return null; //Einträge die keine Namen liefern werden aussortiert

  const street = tags["addr:street"] ?? "";
  const housenumber = tags["addr:housenumber"] ?? "";
  const city = tags["addr:city"] ?? "";
  const postcode = tags ["addr:postcode"] ?? "";
  const addressParts = [street, housenumber, postcode, city].filter(Boolean);
  const address = addressParts.join(" ");
  
  return {

    id: String(el.id),
    name,
    address,
    lat: el.lat ?? el.center?.lat ?? 0,
    lon: el.lon ?? el.center?.lon ?? 0,
    vegetarisch: tags["diet:vegetarian"] === "yes" ? 1 : 0, 
    vegan: tags["diet:vegan"] === "yes" ? 1 : 0,
    //glutenfrei: tags["diet:gluten_free"] === "yes" ? 1 : 0,
  };
}
// -------------------------------------------------------------
// soll merken statt wieder neu zu rendern
// -------------------------------------------------------------

const PlaceItem = React.memo(({ item, onPress }: any) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.addresse}>{item.address || "Standort siehe Karte"}</Text> 
      </View>
    </TouchableOpacity>
  );
});


//Suchscreen: Kontrolliert Vorgang Filter und Daten:
// lädt Orte, verwaltet Filter und Navigation
export default function Suche() {
  const [filters, setFilters] = useState<string[]>([]); 
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------
  // Cache: API-Abfrage
  // -------------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const cached = await loadApiResponse();
        if (cached && isMounted) {
          setPlaces(cached);
        setLoading(false);
        return;
        }

        // kleine Verzögerung (Overpass-schonend)
        await new Promise((res) => setTimeout(res, 4000));

        const url =
          "https://overpass-api.de/api/interpreter?data=" +
          "[out:json][timeout:10000];" +
          "(" +
          'node["amenity"="take_away"](47.3200,8.4500,47.4300,8.6300);' +
          'node["amenity"="cafe"](47.3200,8.4500,47.4300,8.6300);' +
          'node["amenity"="bakery"](47.3200,8.4500,47.4300,8.6300);' +
          'node["amenity"="food_court"](47.3200,8.4500,47.4300,8.6300);' +
          'way["amenity"="take_away"](47.3200,8.4500,47.4300,8.6300);' +
          'way["amenity"="cafe"](47.3200,8.4500,47.4300,8.6300);' +
          'way["amenity"="bakery"](47.3200,8.4500,47.4300,8.6300);' +
          'way["amenity"="food_court"](47.3200,8.4500,47.4300,8.6300);' +
          ");out center tags;";

        const response = await fetch(url);
        const json = await response.json();
        const elements = json.elements ?? [];
        const transformed = elements.map(transformOverpassElement).filter(Boolean);

        if (!isMounted) return

        setPlaces(transformed);
        setLoading(false);
        setTimeout(() => {
          saveApiResponse(transformed.slice(0, 1500));
        }, 0);
      } 
      catch (e) {
        console.error("API Fehler:", e);
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------------------------------------------
  // FILTER 
  // -------------------------------------------------------------

  const finalFilteredPlaces = useMemo(() => {
    if (filters.length === 0) return places;

    return places.filter((place) =>
      filters.every((f) => {
        if (f === "vegan") return place.vegan === 1;
        if (f === "vegetarisch") return place.vegetarisch === 1;
        //if (f === "glutenfrei") return place.glutenfrei=== 1;
        return true;
      })
    );
  }, [filters, places]);

  // Wechsel zur Kartenseite
  const renderItem = useCallback(
    ({ item }: any) => (
      <PlaceItem
        item={item}
        onPress={() =>
          router.push({
            pathname: "/Karte",
            params: {
              lat: item.lat,
              lon: item.lon,
              title: item.name,
            },
          })
        }
      />
    ), 
  []);
  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Filter</Text>
      
      <View style={styles.filterColumn}>
        {["vegetarisch", "vegan"].map((f) => {
          const isActive = filters.includes(f);
          return (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                isActive && styles.filterButtonActive,
              ]}
              onPress={() =>
                setFilters((prev) =>
                  isActive ? prev.filter((x) => x !== f) : [...prev, f]
                )
              }
            >
              <Text
                style={[
                  styles.filterText,
                  isActive && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}
<Text>
  {finalFilteredPlaces.length} von {places.length} Orten
</Text>

      <FlatList
        data={finalFilteredPlaces}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}

// -------------------------------------------------------------
// STYLE
// -------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
  },
  filterColumn: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: "40%",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: { backgroundColor: "#00ffa2ff" },
  filterText: { color: "#000", fontWeight: "500", fontSize: 14 },
  filterTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  addresse: { color: "#000" },
});