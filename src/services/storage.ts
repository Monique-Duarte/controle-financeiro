import { Preferences } from '@capacitor/preferences';

export const setData = async (key: string, value: unknown) => {
  await Preferences.set({
    key,
    value: JSON.stringify(value),
  });
};

export const getData = async <T = unknown>(key: string): Promise<T | null> => {
  const result = await Preferences.get({ key });
  return result.value ? (JSON.parse(result.value) as T) : null;
};

export const removeData = async (key: string) => {
  await Preferences.remove({ key });
};

export const clearAllData = async () => {
  await Preferences.clear();
};
