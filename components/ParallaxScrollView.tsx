import { useCallback, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";

type Props = {
  children: React.ReactNode;
  headerHeight?: number;
  headerBackgroundColor?: string;
  headerTintColor?: string;
  headerTitle?: string;
  headerTitleStyle?: any;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  onScroll?: (event: any) => void;
  scrollEventThrottle?: number;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  style?: any;
  contentContainerStyle?: any;
};

export function ParallaxScrollView({
  children,
  headerHeight = 200,
  headerBackgroundColor = Colors.light.tint,
  headerTintColor = "white",
  headerTitle,
  headerTitleStyle,
  headerLeft,
  headerRight,
  onScroll,
  scrollEventThrottle = 16,
  showsVerticalScrollIndicator = false,
  bounces = true,
  style,
  contentContainerStyle,
}: Props) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const handleScroll = useCallback(
    (event: any) => {
      scrollY.setValue(event.nativeEvent.contentOffset.y);
      onScroll?.(event);
    },
    [scrollY, onScroll]
  );

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            backgroundColor: headerBackgroundColor,
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        <View style={styles.headerContent}>
          {headerLeft && <View style={styles.headerLeft}>{headerLeft}</View>}
          {headerTitle && (
            <Animated.Text
              style={[
                styles.headerTitle,
                { color: headerTintColor },
                headerTitleStyle,
              ]}
            >
              {headerTitle}
            </Animated.Text>
          )}
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.scrollView, { paddingTop: headerHeight }]}
        contentContainerStyle={contentContainerStyle}
        onScroll={handleScroll}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        bounces={bounces}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 2,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  scrollView: {
    flex: 1,
  },
});
