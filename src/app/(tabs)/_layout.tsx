import { BACKGROUND_TEXT, BUTTON, MAIN_ALT, MAIN_TEXT } from "@/constants/colors";
import { JosefinSans_500Medium, useFonts } from "@expo-google-fonts/dev";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const FONT = "JosefinSans_500Medium"
export const FONT_CLASS = JosefinSans_500Medium

export default function TabLayout() {
  const [ loadedFonts ] = useFonts({JosefinSans_500Medium})
  if (!loadedFonts) return null
  return <>
  <StatusBar style="auto" animated/>
  <Tabs screenOptions={{
    headerShown: false,
    tabBarStyle: {backgroundColor: MAIN_ALT, borderColor: "rgba(0, 0, 0, 0)"},
    tabBarActiveBackgroundColor: BUTTON,
    tabBarActiveTintColor: MAIN_TEXT,
    tabBarInactiveTintColor: BACKGROUND_TEXT,
    tabBarShowLabel: false,
    tabBarIconStyle: { flex: 1 }
    }}>
    <Tabs.Screen 
    name="index" 
    
    options={{
      tabBarIcon: ({color, size, focused}) => (
        <Ionicons color={color} size={size} name={"analytics"}/>
      ),
      
    }}
    />
    <Tabs.Screen 
    name="compras" 
    options={{
      tabBarIcon: ({color, size, focused}) => (
          <Ionicons color={color} size={size} name={"bag"} />
      )
      
    }}
    />
  </Tabs>
  </>;
}

