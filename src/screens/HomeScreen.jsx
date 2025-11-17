import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SwipeableCard from "../components/SwipeableCard";
import useSwipeGesture from "../hooks/useSwipeGesture";

export default function HomeScreen() {
  const resetRef = useRef(null);

  const { gesture, translateX, translateY, scale } = useSwipeGesture(() => { });

  return (
    <View style={styles.container}>

      <SwipeableCard
        gesture={gesture}
        translateX={translateX}
        translateY={translateY}
        scale={scale}
        onCreateReset={(resetFn) => {
          resetRef.current = resetFn;
        }}
      />

      <TouchableOpacity
        onPress={() => resetRef.current()}
        style={styles.ResetButton}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
          Reset
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ResetButton: {
    backgroundColor: "#841584",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#841584",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
