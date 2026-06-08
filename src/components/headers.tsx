import { StyleSheet, Text, View } from "react-native";

export function H1 ({ children }: { children: string }) {
    return (
        <View style={styles.container}>
            <Text style={styles.h1}>{children}</Text>
        </View>
    )
}

export function H2 ({ children }: { children: string }) {
    return (
        <View style={styles.container}>
            <Text style={styles.h2}>{children}</Text>
        </View>
    )
}

export function H3 ({ children }: { children: string }) {
    return (
        <View style={styles.container}>
            <Text style={styles.h3}>{children}</Text>
        </View>
    )
}

export function H4 ({ children }: { children: string }) {
    return (
        <View style={styles.container}>
            <Text style={styles.h4}>{children}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    fontSize: 32
  },
  h2: {
    fontSize: 24
  },
  h3: {
    fontSize: 18
  },
  h4: {
    fontSize: 16
  }
});