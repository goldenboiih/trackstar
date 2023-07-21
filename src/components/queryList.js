import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Query from "./query";

export default function QueryList({ questions }) {
    return (
        <ScrollView style={styles.container}>
            {questions.map((question, index) => (
                <View key={index} style={styles.queryContainer}>
                    <Query question={question} />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    queryContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
});
