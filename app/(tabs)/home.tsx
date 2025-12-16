import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
const router = useRouter();
const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------
  // Kurze Wartezeit beim App-Start 
  // (Stabilisierung weil es sonst direkt beginnt zu rendern)
  // -------------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // 0.5–1s, einfach kurz ein Moment zum Aufstarten 

    return () => clearTimeout(timer);
  }, []);

  // LADEBILDSCHIRM: Splash Screen 
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>
          App wird vorbereitet …
        </Text>
      </View>
    );
  }
  
  // ----------------------------------------------------------------
  // NORMALE UI (danach)
  // ------------------------------------------------------------------

  return (
    <View style={styles.container}>

      <Text style={styles.text}>Willkommen</Text>
      <Text style={styles.text}>Worauf hast du heute Lust?</Text>

      <TouchableOpacity
        style={styles.buttonSmall}
        onPress={() => router.push("/Suche")}
      >
        <Text style={styles.buttonText}>Suchen</Text>
      </TouchableOpacity>
    </View>
  );
}

// -------------------------------------------------------------
// STYLE
// -------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },

  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  buttonSmall: {
    backgroundColor: "#00ffa2ff",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    width: "80%",
    marginTop: 30,
  },

  buttonText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    color: "#000",
  },
});
