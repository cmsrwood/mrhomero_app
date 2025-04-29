import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

export default function ProgressBar({ progress, meta }) {
    return (
        <View style={{ alignItems: 'center' }}>
            <Progress.Bar color='#FFC107' progress={progress / meta} width={null} height={10} style={styles.progressBar} />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }}>{progress} / {meta}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    progressBar: {
        width: '100%',
        height: 10,
    },
});