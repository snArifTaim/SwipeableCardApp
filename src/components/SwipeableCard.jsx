import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import AnimatedR, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
} from "react-native-reanimated";

import AntDesign from '@expo/vector-icons/AntDesign';

export default function SwipeableCard({
  translateX,
  translateY,
  scale,
  gesture,
  onCreateReset,
}) {
  const fadeOpacity = useRef(new Animated.Value(1)).current;

  const dragX = useRef(new Animated.Value(0)).current;

  Animated.event(
    [{ nativeEvent: { translationX: dragX } }],
    { useNativeDriver: true }
  );

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      scale.value = withSpring(1.15, {}, () => {
        scale.value = withSpring(1);
      });
    });

  const combined = Gesture.Simultaneous(doubleTap, gesture);
  const [gestureEnabled, setGestureEnabled] = React.useState(true);

  useEffect(() => {
    onCreateReset(() => {

      setGestureEnabled(false);

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);

      Animated.timing(fadeOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      requestAnimationFrame(() => {
        setGestureEnabled(true);
      });
    });
  }, []);

  const rStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      translateX.value,
      [-250, 0, 250],
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  return (
    <GestureDetector gesture={combined} enabled={gestureEnabled}>
      <Animated.View style={{ opacity: fadeOpacity }}>
        <AnimatedR.View style={[styles.card, rStyle]}>
          <Text style={styles.title}><AntDesign name="fire" size={26} color="#ff3b30" /> Swipe Me</Text>

          <Text style={styles.subText}>
            Drag • Swipe • Rotate • Double Tap
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 14, color: "#999" }}>
              Smooth Reanimated v4 Demo
            </Text>
          </View>
        </AnimatedR.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 330,
    height: 220,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,

    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
  },
  subText: {
    marginTop: 10,
    color: "#777",
    fontSize: 15,
  },
});

