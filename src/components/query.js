import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from "axios";
import CONFIG from "../../config.json";
import { AppContext } from "../../App";

export default function Query({ question, getQueriesFromDb }) {
    const { expoPushToken } = useContext(AppContext);

    const setAnswer = async (answer) => {
        console.log('Question id: ' + question.id, 'Answer: ' + answer);
        try {
            axios.post('http://' + CONFIG.localIp + ':3000/send-answer', {
                id: question.id,
                token: expoPushToken,
                answer: answer,
            })
            console.log('Answer sent via Button inside application view')
            getQueriesFromDb()
        } catch (error) {
            console.error('Error sending answer inside application view' + error);
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
