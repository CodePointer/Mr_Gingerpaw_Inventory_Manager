import AsyncStorage from '@react-native-async-storage/async-storage';

let tokenCache: string | null = null;
const STORAGE_KEY = 'login_token';


export async function getToken(): Promise<string | null> {
  if (tokenCache !== null) return tokenCache;
  tokenCache = await AsyncStorage.getItem(STORAGE_KEY);
  return tokenCache;
}

export async function setToken(token: string | null): Promise<void> {
  tokenCache = token;
  if (token) {
    await AsyncStorage.setItem(STORAGE_KEY, token);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}
