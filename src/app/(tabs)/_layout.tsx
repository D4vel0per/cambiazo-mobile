import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return <>
  <StatusBar style="auto" animated/>
  <Tabs screenOptions={{headerShown: false}}>
    <Tabs.Screen name="index" options={{title: "Tazas"}}/>
    <Tabs.Screen name="compras" options={{title: "Compras"}}/>
  </Tabs>
  </>;
}

