import AsyncStorage from '@react-native-async-storage/async-storage';


export async function saveState<T>(key: string, state: T): Promise<boolean> {
  try {
    const json = JSON.stringify(state, (_, value) => {
      if (value instanceof Set) {
        return { __type: 'Set', values: Array.from(value) };
      }
      return value;
    })
    // console.log('save:', json)
    await AsyncStorage.setItem(key, json)
  } catch (e) {
    return false;
  } finally {
    return true;
  }
}


export async function loadState<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (json === null) return defaultValue;
    const state = JSON.parse(json, (_, value) => {
      if (value && value.__type === 'Set') {
        return new Set(value.values as any[]);
      }
      return value;
    })
    return state;
  } catch (e) {
    return defaultValue;
  }
}
