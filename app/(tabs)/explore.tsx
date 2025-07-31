import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

export default function ProfileScreen() {
  return (
    <View
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <Text style={[styles.title, { color: Colors.light.text }]}>Explore</Text>

      <View style={[styles.card, { backgroundColor: Colors.light.tint }]}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <Text style={styles.cardDescription}>
          Discover new features and manage your account
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
          Recent Activity
        </Text>
        <View style={styles.activityItem}>
          <Text style={[styles.activityText, { color: Colors.light.text }]}>
            Payment sent to John Doe
          </Text>
          <Text
            style={[
              styles.activityTime,
              { color: Colors.light.tabIconDefault },
            ]}
          >
            2 hours ago
          </Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={[styles.activityText, { color: Colors.light.text }]}>
            Payment received from Jane Smith
          </Text>
          <Text
            style={[
              styles.activityTime,
              { color: Colors.light.tabIconDefault },
            ]}
          >
            1 day ago
          </Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={[styles.activityText, { color: Colors.light.text }]}>
            Account balance updated
          </Text>
          <Text
            style={[
              styles.activityTime,
              { color: Colors.light.tabIconDefault },
            ]}
          >
            3 days ago
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.light.text }]}>
          Quick Links
        </Text>
        <View style={styles.linkItem}>
          <Text style={[styles.linkText, { color: Colors.light.text }]}>
            View Transaction History
          </Text>
        </View>
        <View style={styles.linkItem}>
          <Text style={[styles.linkText, { color: Colors.light.text }]}>
            Manage Payment Methods
          </Text>
        </View>
        <View style={styles.linkItem}>
          <Text style={[styles.linkText, { color: Colors.light.text }]}>
            Security Settings
          </Text>
        </View>
        <View style={styles.linkItem}>
          <Text style={[styles.linkText, { color: Colors.light.text }]}>
            Help & Support
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  activityText: {
    fontSize: 16,
    flex: 1,
  },
  activityTime: {
    fontSize: 14,
  },
  linkItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  linkText: {
    fontSize: 16,
  },
});
