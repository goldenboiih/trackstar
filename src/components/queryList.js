import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Query from "./query";

export default function QueryList({questions})
{
    return (
        <ScrollView>
            {questions.map((question, index) => (
                <View key={index}>
                    <Query question={question}/>
                </View>
            ))}
        </ScrollView>
    );
}
