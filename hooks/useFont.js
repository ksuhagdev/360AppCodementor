import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

export default function useFont() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'font-bold': require('../assets/fonts/Montserrat-Bold.ttf'),
        'font-regular': require('../assets/fonts/Montserrat-Medium.ttf'),
        'font-light': require('../assets/fonts/Montserrat-Regular.ttf'),
      });
      setFontLoaded(true);
    })();
  }, []);

  return fontLoaded;
}
