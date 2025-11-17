import { Dimensions } from "react-native";
import {
  useSharedValue,
  withSpring,
  withDecay,
  runOnJS,
} from "react-native-reanimated";

import { Gesture } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.3;

export default function useSwipeGesture(onDismiss) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onStart(() => {
      translateX.startX = translateX.value;
    })
    .onUpdate((e) => {
      translateX.value = translateX.startX + e.translationX;
      translateY.value = e.translationY * 0.25;
    })
    .onEnd((e) => {
      const shouldDismiss =
        Math.abs(translateX.value) > SWIPE_THRESHOLD ||
        Math.abs(e.velocityX) > 900;

      if (shouldDismiss) {
        translateX.value = withDecay({
          velocity: e.velocityX,
          deceleration: 0.995,
        });

        runOnJS(onDismiss)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  return {
    gesture,
    translateX,
    translateY,
    scale,
  };
}
