import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AdminLayout({ children }) {
    const navigation = useNavigation();

    return (
        <View style={globalStyles.containerfluid}>
            <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.menuButton}
            >
                <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                {children}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 10,
    },
    content: {
        flexGrow: 1,
        paddingVertical: 100,
        paddingBottom: 70,
    },
});
