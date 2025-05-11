import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import mrhomeroImg from "../assets/favicon.png";
import { Linking, Alert } from "react-native";


export default function Footer() {
    const openLink = async (url) => {
        const link = await Linking.canOpenURL(url);
        if (link) {
            await Linking.openURL(url);
        } else {
            Alert.alert("No se pudo abrir el enlace", url);
        }
    }

    return (
        <View style={styles.footer}>
            <View style={styles.line} />
            <Image source={mrhomeroImg} style={styles.imgFooter} />
            <View style={styles.containerFooter}>
                <View style={styles.infoContent}>
                    <Text style={styles.textBold}>
                        Mr. Homero: La receta del sabor que te hará volver por más.
                    </Text>
                    <Text style={styles.contentText}>
                        Disfruta de nuestras irresistibles hamburguesas, perros calientes, papas crocantes, bebidas refrescantes y mucho más. ¡El sabor único de Mr. Homero te espera! Conoce nuestro menú y vive una experiencia deliciosa.
                    </Text>
                </View>
                <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                    <View style={styles.infoContent}>
                        <Text style={styles.textBold}>
                            Contacto
                        </Text>
                        <Text style={styles.contentText}>
                            Cl. 25 Sur #6-30, San Cristóbal
                            Bogotá, Cundinamarca
                            Llamanos: 300 123 4567
                            Correos: 4bDd0@example.com
                            Trabaja con nosotros
                        </Text>
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.textBold}>
                            Horarios de atención
                        </Text>
                        <Text style={styles.contentText}>
                            Martes a Viernes de 10:00 a 20:00 {"\n"}
                            Sabados de 10:00 a 18:00
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.line} />
            <View style={styles.infoEnd}>
                <View style={styles.icons}>
                    <TouchableOpacity onPress={() => openLink("https://www.facebook.com/p/Comidas-Rapidas-Mr-Homero-100050735053665/?locale=es_LA")}>
                        <Ionicons name="logo-facebook" size={23} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink("https://www.instagram.com/mrhomerocomidasrapidas/")}>
                        <Ionicons name="logo-instagram" size={23} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink("https://www.tiktok.com/@mrhomerocomidasrapidas")}>
                        <Ionicons name="logo-tiktok" size={23} color="#ccc" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.contentText}>Mr. Homero © 2025. Todos los derechos reservados.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        width: "100%",
        position: "relative",
    },
    line: {
        width: "100%",
        height: 0.4,
        backgroundColor: "#ccc",
        marginVertical: 20,
    },
    imgFooter: {
        width: 60,
        height: 60,
        alignSelf: "flex-start",
        marginLeft: 20,
    },
    containerFooter: {
        display: "flex",
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 10,
    },
    textBold: {
        fontWeight: "bold",
        marginBottom: 10,
        color: "#fff",
        fontSize: 13,
    },
    contentText: {
        color: "#ccc",
        fontSize: 12,
    },
    infoContent: {
        marginLeft: 20,
        marginRight: 20,
        width: 150,
    },
    infoEnd: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    icons: {
        flexDirection: "row",
        alignSelf: "flex-start",
        gap: 10,
        marginLeft: 20,
        marginBottom: 15
    }
});