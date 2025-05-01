import { StyleSheet, Platform } from "react-native";
import Constants from "expo-constants";

const globalStyles = StyleSheet.create({
    containerfluid: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        // backgroundColor: "#2B3035",
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

    error: {
        color: "red",
    },

    title: {
        fontSize: 60,
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "Homer-Simpson",
        color: "#FFC107",
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

    fontHomero: {
        fontFamily: "Homer-Simpson",
    },
    botonCerrar: {
        backgroundColor: "#FFC107",
        borderRadius: 30,
        zIndex: 10,
        padding: 5,
        position: "absolute",
        top: '-3%',
        right: '-4%',
        display: "flex",
        flexDirection: "row",
        gap: 5
    },
    // Tarjetas
    row: {
        padding: 10,
        marginVertical: 10,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    card: {
        display: 'flex',
        alignSelf: 'center',
        height: 260,
        width: 170,
        marginVertical: 10,
        backgroundColor: '#2B3035',
        shadowColor: '#fff',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
    },
    img: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    cardText: {
        fontSize: 13,
        color: '#ccc',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    cardActions: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center'
    },
    cardEdit: {
        alignItems: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#FFC107',
        borderRadius: 10,
        padding: 10
    },
    cardRestore: {
        width: 40,
        height: 40,
        backgroundColor: '#198754',
        borderRadius: 10,
        padding: 10
    },
    cardDelete: {
        width: 40,
        height: 40,
        backgroundColor: '#BB2D3B',
        borderRadius: 10,
        padding: 10
    },
    positive: {
        color: '#28a745'
    },
    negative: {
        color: '#dc3545'
    },
    pickerIOS: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        height: 50,
        marginVertical: 10
    },
    picker: {
        color: '#fff',
        backgroundColor: '#2B3035',
        height: Platform.OS === 'ios' ? 50 : 54,
        justifyContent: 'center',
        width: '100%',
    },
    naranja: {
        color: '#FFC107'
    }
});

export default globalStyles;