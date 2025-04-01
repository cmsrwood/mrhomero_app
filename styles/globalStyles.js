import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#2B3035",
        color: "#ffffff",
        alignContent: "center",
    },

    flex: {
        display: "flex",
        flexDirection: "row",
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },

    button: {
        backgroundColor: "#FFC107",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        borderRadius: 15,
    },

    buttonText: {
        color: "#fffff",
        fontSize: 16,
    },
});

export default globalStyles;