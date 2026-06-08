import { H1, H2 } from "@/components/headers";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <H1>CAMBIAZO!</H1>
        <H2>¿No puedes con la inflación? ¡Nosotros tampoco!</H2>
      </View>
      <LastInfo />
    </SafeAreaView>
  );
}

function LastInfo () {
  return (
    <View style={styles.product_container}>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    flex: 1,
    padding: 5
  },
  product_container: {
    flex: 3,
    backgroundColor: "#0A5B6B",
    width: "100%"
  }
});
