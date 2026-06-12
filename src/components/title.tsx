import { FONT } from "@/app/(tabs)/_layout"
import { BACKGROUND_TEXT, MAIN_ALT } from "@/constants/colors"
import { StyleSheet, Text, View } from "react-native"

export default function Title ({name}: {name: string}) {
    return (
        <View style={styles.title}>
            <Text style={styles["title.text"]}>{name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        padding: 10,
        justifyContent: "flex-start",
        backgroundColor: MAIN_ALT
    },
    "title.text": {
        fontSize: 24,
        fontFamily: FONT,
        color: BACKGROUND_TEXT,
        textAlign: "center"
    },
})