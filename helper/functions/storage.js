import AsyncStorage from '@react-native-community/async-storage';

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('accessToken');
    if (value) {
      return value;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const setToken = async token => {
  try {
    await AsyncStorage.setItem('accessToken', token);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getData = async key => {
  try {
    const user = await AsyncStorage.getItem(key);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const setData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
