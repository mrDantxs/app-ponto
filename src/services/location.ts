import * as Location from 'expo-location';
import { LocationInfo } from '../types/ponto';

export async function getCurrentUserLocation(): Promise<LocationInfo | undefined> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        latitude: -23.5505,
        longitude: -46.6333,
        address: 'Permissão não concedida (Modo Local Padrão)',
      };
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    let addressStr: string | undefined;
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const item = geocode[0];
        const parts = [item.street, item.streetNumber, item.subregion, item.city, item.region].filter(Boolean);
        addressStr = parts.join(', ');
      }
    } catch {
      addressStr = `Lat: ${loc.coords.latitude.toFixed(4)}, Long: ${loc.coords.longitude.toFixed(4)}`;
    }

    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy ?? undefined,
      address: addressStr || `Coordenadas: ${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`,
    };
  } catch (error) {
    console.warn('Não foi possível obter geolocalização real, usando fallback:', error);
    return {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'São Paulo, SP - Sede da Empresa (Offline/Simulado)',
    };
  }
}
