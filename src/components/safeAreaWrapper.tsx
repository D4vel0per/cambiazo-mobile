import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeArea ({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();
      const [ st, setSt ] = useState({});
    
      useEffect(() => {
        setSt({
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        })
      }, [insets])
      return (
        <View style={st}>{children}</View>
      )
}