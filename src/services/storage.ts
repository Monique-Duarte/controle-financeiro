import { Preferences } from '@capacitor/preferences';

export const setData = async (key: string, value: unknown) => {
  await Preferences.set({
    key,
    value: JSON.stringify(value),
  });
};

export const getData = async (key: string) => {
  const result = await Preferences.get({ key });
  return result.value ? JSON.parse(result.value) : null;
};
