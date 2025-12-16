import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'places';

export async function saveApiResponse(responseJson: any) {
  try {
    const jsonString = JSON.stringify(responseJson);
    await AsyncStorage.setItem(STORAGE_KEY, jsonString);
  } catch (e) {
    console.error('Fehler beim Speichern der API-Daten:', e);
  }
}

export async function loadApiResponse() {
  try {
    const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Fehler beim Laden der API-Daten:', e);
    return null; 
  }
}
