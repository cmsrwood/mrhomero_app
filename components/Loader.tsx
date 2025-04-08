import React from 'react'
import { ActivityIndicator } from 'react-native'

export default function Loader() {
    return (
        <ActivityIndicator size="large" color="#FFC107" style={{ marginTop: 100, backgroundColor: "#2B3035", height: "100%", width: "100%" }} />
    )
}
