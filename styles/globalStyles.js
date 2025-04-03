import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const globalStyles = StyleSheet.create({
    containerfluid: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#2B3035",
        color: "#ffffff",
        alignContent: "center",
    },
    container: {
        padding: 30,
    },

    flex: {
        display: "flex",
        flexDirection: "row",
    },

    title: {
        fontSize: 60,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "Homer-Simpson",
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