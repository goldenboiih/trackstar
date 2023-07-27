import React, { useEffect, useRef, useState } from 'react';
import { Button, Platform, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { sendPushNotification } from "./backend/notification-handler";
import axios from 'axios';
import QueryList from "./src/components/queryList";

const CONFIG = require('./config.json');

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const [queries, setQueries] = useState([]);
    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                console.log('Permission not granted')
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        getQueriesFromDb();
    }, []);

    const getQueriesFromDb = () => {
        axios.get('http://' + CONFIG.localIp + ':3000/get-queries')
            .then(response => {
                if (response.data.success) {
                    setQueries(response.data.queries);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        Notifications.setNotificationCategoryAsync('INTERACTIVE_CATEGORY', [
            { identifier: '1', buttonTitle: '1' },
            { identifier: '2', buttonTitle: '2' },
            { identifier: '3', buttonTitle: '3' },
            { identifier: '4', buttonTitle: '4' },
            { identifier: '5', buttonTitle: '5' }
        ], { showInForeground: true });

        // Clean up the category when the component unmounts
        return () => {
            Notifications.setNotificationCategoryAsync(null);
        };
    }, []);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log('Notification: ' + notification.request.content.title, notification.request.content.body);
            console.log(notification.request.content.data);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Response: ');
            try {
                axios.post('http://' + CONFIG.localIp + ':3000/send-answer', {
                    id: notification.request.content.data.query_id,
                    answer: parseInt(response.actionIdentifier),
                    answered: true
                })
                console.log('Answer sent')
                getQueriesFromDb()
            } catch (error) {
                console.error('Error sending request:' + error);
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Your Expo Push Token:</Text>
                <Text style={styles.pushTokenText}>{expoPushToken}</Text>
            </View>
            <QueryList getQueriesFromDb={getQueriesFromDb} questions={queries} />
            <View style={styles.buttonContainer}>
                <Button
                    title="Refresh Queries"
                    onPress={() => getQueriesFromDb()}
                    color="#3498db"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#3498db',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    pushTokenText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
    },
    buttonContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
});

