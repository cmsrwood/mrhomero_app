import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import mrhomeroImg from "../assets/favicon.png";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";

export default function DefaultLayout({ children }) {
    const navigation = useNavigation();

    return (
        <View style={globalStyles.containerfluid}>
            {/* Header */}
            <View style={[styles.header, globalStyles.flex]}>
                <Image source={mrhomeroImg} style={{ width: 40, height: 40 }} />
                <Text style={[styles.headerText, { color: "#FFF", paddingLeft: 10 }]}>Mr. Homero</Text>
            </View>

            {/* Contenido Principal */}
            <ScrollView contentContainerStyle={styles.content}>
                {children}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        justifyContent: "space-between",
    },
    header: {
        backgroundColor: "#2B3035",
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    content: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingBottom: 70,
    },
    footer: {
        backgroundColor: "#2B3035",
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
    },
    navbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
    },
    ButtonNavbar: {
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    ButtonNavbarText: {
        color: "#FFF",
        fontSize: 14,
    }
});
