import { Animated } from 'react-native';
import { useRef , useEffect} from 'react';

export default function useRotation() {
    const animation = useRef(new Animated.Value(0)).current;

    function startAnimation() {
       
          Animated.timing(animation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }) .start()
    }
    useEffect(() => {
        startAnimation();
    });    

    //interpolate
    const rotateInterpolation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return rotateInterpolation;
}
