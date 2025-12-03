import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import HomeScreen from './screens/HomeScreen';
import FocusScreen from './screens/FocusScreen';
import CapturedScreen from './screens/CapturedScreen';
import ProfileScreenContainer from './screens/ProfileScreenContainer';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get("window");
const FAB_SIZE = 64;
const FAB_RADIUS = FAB_SIZE / 2;
const NAV_BAR_HEIGHT = Platform.OS === "ios" ? 85 : 80;

type TabType = "home" | "focus" | "add" | "captured" | "profile";

const BottomTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const renderTabIcon = (tab: TabType, isActive: boolean) => {
    const iconColor = isActive ? "#FF6B6B" : "#FFFFFF";

    switch (tab) {
      case "home":
        return (
          <View style={styles.iconContainer}>
            <Octicons name="home" size={24} color={iconColor} />
          </View>
        );
      case "focus":
        return (
          <View style={styles.iconContainer}>
            {/* <MaterialIcons name="timer" size={24} color={iconColor} /> */}
            <MaterialIcons
              name="do-not-disturb-on-total-silence"
              size={30}
              color={iconColor}
            />
          </View>
        );
      case "add":
        return (
          <View style={styles.addIconContainer}>
            <View style={styles.fabCircle}>
              <MaterialIcons name="add" size={28} color="#FFFFFF" />
            </View>
          </View>
        );
      case "captured":
        return (
          <View style={styles.capturedIconContainer}>
            <Entypo name="bell" size={24} color={iconColor} />
          </View>
        );
      case "profile":
        return (
          <View style={styles.iconContainer}>
            <View style={[styles.profileIcon, { borderColor: iconColor }]}>
              <View
                style={[styles.profileHead, { backgroundColor: iconColor }]}
              />
              <View
                style={[styles.profileBody, { backgroundColor: iconColor }]}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "focus":
        return <FocusScreen />;
      case "captured":
        return <CapturedScreen />;
      case "profile":
        return <ProfileScreenContainer />;
      default:
        return <HomeScreen />;
    }
  };

  const handleTabPress = (tab: TabType) => {
    if (tab !== "add") {
      setActiveTab(tab);
    } else {
      // Handle Add button press
      console.log("Add button pressed");
      // You can add navigation logic or modal here
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBarContainer}>
        <View style={styles.navBarWrapper}>
          {/* SVG Curved Background with Smooth Concave Notch */}
          <Svg width={width} height={NAV_BAR_HEIGHT} style={styles.navBarSvg}>
            <Path
              d={`
                M0 0
                L${width * 0.3} 0
                C${width * 0.43} 0 ${width * 0.38} 36 ${width * 0.5} 38
                C${width * 0.610} 36 ${width * 0.60} 0 ${width * 0.67} 0
                L${width} 0
                L${width} ${NAV_BAR_HEIGHT}
                L0 ${NAV_BAR_HEIGHT}
            `}
              fill="#1A1A1A"
            />
          </Svg>

          {/* Navigation Content Layer */}
          <View style={styles.navBarContent}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("home")}
              activeOpacity={0.6}
            >
              {renderTabIcon("home", activeTab === "home")}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "home" && styles.tabLabelActive,
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("focus")}
              activeOpacity={0.6}
            >
              {renderTabIcon("focus", activeTab === "focus")}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "focus" && styles.tabLabelActive,
                ]}
              >
                Focus
              </Text>
            </TouchableOpacity>

            {/* Spacer for Floating FAB */}
            <View style={styles.fabSpacer} />

            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("captured")}
              activeOpacity={0.6}
            >
              {renderTabIcon("captured", activeTab === "captured")}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "captured" && styles.tabLabelActive,
                ]}
              >
                Captured
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress("profile")}
              activeOpacity={0.6}
            >
              {renderTabIcon("profile", activeTab === "profile")}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "profile" && styles.tabLabelActive,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Floating Action Button - Fixed Position */}
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={styles.fabTouchable}
              onPress={() => handleTabPress("add")}
              activeOpacity={0.9}
            >
              {renderTabIcon("add", false)}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
  },
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_BAR_HEIGHT,

  },
  navBarWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  navBarSvg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBarContent: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_BAR_HEIGHT,
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === "ios" ? 8 : 10,
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minHeight: 50,
  },
  tabLabel: {
    fontSize: 11,
    color: "#FFFFFF",
    marginTop: 4,
    fontWeight: "400",
  },
  tabLabelActive: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  fabSpacer: {
    width: FAB_SIZE,
    height: FAB_SIZE,
  },
  fabContainer: {
    position: "absolute",
    bottom: NAV_BAR_HEIGHT - FAB_RADIUS - 20,
    left: (width - FAB_SIZE) / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  fabTouchable: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  fabCircle: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_RADIUS,
    backgroundColor: "#E88B6B",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.25,
    // shadowRadius: 6,
    // elevation: 6,
  },
  fabLabel: {
    fontSize: 11,
    color: "#FFFFFF",
    marginTop: 4,
    fontWeight: "400",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  addIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  capturedIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 24,
    minHeight: 24,
  },
  // Profile Icon Styles
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  profileHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 1,
  },
  profileBody: {
    width: 12,
    height: 6,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

export default BottomTabNavigator;
