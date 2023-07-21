import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from "axios";

export default function Query({ question, getQueriesFromDb }) {

    const setAnswer = (answer) => {
        console.log(question.id, answer);
        try {
            axios.post('http://192.168.0.247:3000/send-answer', {
                id: question.id,
                answer: answer,
                answered: true
            })
            console.log('Answer sent')
            getQueriesFromDb()
        } catch (error) {
            console.error('Error sending request:' + error);
        }

    }

    return (
        <View>
            <Text style={styles.question}>{question.question}</Text>
            <View style={styles.buttonContainer}>
                {[1, 2, 3, 4, 5].map((answer) => (
                    <TouchableOpacity key={answer} onPress={() => setAnswer(answer)} style={[styles.answerButton, { backgroundColor: '#3498db' }]}>
                        <Text style={styles.answerButtonText}>{answer}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 50,
        width: 300,
        marginTop: 10,
    },
    answerButton: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    answerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
