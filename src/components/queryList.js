import React from 'react';
import { View, Text } from 'react-native';
import Query from "./query";

export default function QueryList({questions})
{
    return (
        <View>
            {questions.map((question, index) => (
                <View key={index}>
                    <Query question={question}/>
                </View>
            ))}
        </View>
    );
}
