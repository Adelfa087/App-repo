import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00ffa2ff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Suche') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Karte') {
            iconName = focused ? 'map' : 'map-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      }
    )
  }
    >
      <Tabs.Screen name="Suche" options={{ title: 'Suche' }} />
      <Tabs.Screen name="Karte" options={{ title: 'Karte' }} />
      <Tabs.Screen name="home" options={{ title: 'home' }} />
    </Tabs>
  );
}
