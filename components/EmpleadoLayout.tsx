import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function AdminLayout({ children }) {
    const navigation = useNavigation();

    return (
        <LinearGradient
            colors={['#2D3036', '#1C1D20']}
            style={globalStyles.containerfluid}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.menuButton}
            >
                <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                {children}
            </ScrollView>
        </LinearGradient>
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
        paddingVertical: 20,
        paddingBottom: 70,
    },
});
