import { View, StyleSheet, Button, Text } from 'react-native';
import axios from "axios";

export default function Query({question}) {

    const setAnswer = (answer) => {
        console.log(question.id, answer)
        try {
            axios.post('http://192.168.0.247:3000/send-answer', {
                id: question.id,
                answer: answer,
                answered: true
            })
            console.log('Answer sent')
        } catch (error) {
            console.error('Error sending request:' + error);
        }
    }

    return (
        <View>
            <Text style={styles.question}>{question.question}</Text>
            <View style={styles.buttonContainer}>
                <Button onPress={() => setAnswer(1)} style={styles.answerButton} title='1'/>
                <Button onPress={() => setAnswer(2)} style={styles.answerButton} title='2'/>
                <Button onPress={() => setAnswer(3)} style={styles.answerButton} title='3'/>
                <Button onPress={() => setAnswer(4)} style={styles.answerButton} title='4'/>
                <Button onPress={() => setAnswer(5)} style={styles.answerButton} title='5'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#add8e6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 50,
        width: 200
    },
    question: {
        backgroundColor: 'green',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10, // Add some margin at the bottom to separate from the buttons
    },
    answerButton: {
        // backgroundColor: 'blue',
        // color: '#fff',
        // fontSize: 20,
        // fontWeight: 'bold',
        // marginHorizontal: 40
    },
});
