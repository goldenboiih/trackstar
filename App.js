import { useEffect, useRef, useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { sendPushNotification } from "./backend/notification-handler";
import axios from 'axios';
import FetchExample from "./src/components/fetchExample";
import Query from "./src/components/query";
import QueryList from "./src/components/queryList";
import { getNotificationCategoriesAsync } from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
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

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const [queries, setQueries] = useState([]);


    useEffect(() => {
        getQueriesFromDb();
    }, []);

    const getQueriesFromDb = () => {
        console.log("Getting queries man")
        axios.get('http://192.168.0.247:3000/queries')
            .then(response => {
                if (response.data.success) {
                    setQueries(response.data.queries);
                    console.log("Success")
                    console.log(queries)
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        // Define interactive notification actions
        const actions = [
            {
                identifier: 'ACTION_ONE',
                buttonTitle: 'Action One',
            },
            {
                identifier: 'ACTION_TWO',
                buttonTitle: 'Action Two',
            },
        ];

        try {
            // Notifications.setNotificationCategoryAsync('INTERACTIVE_CATEGORY', actions);
            Notifications.setNotificationCategoryAsync('INTERACTIVE_CATEGORY', actions, {showInForeground: true})
        } catch (e) {
            console.log(e)
        }

            // Clean up the category when the component unmounts
            return () => {
                Notifications.setNotificationCategoryAsync(null);
            };
        }, []);

    const handlePress = async () => {
        // Schedule a notification using the defined category
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Interactive Notification',
                body: 'Tap to see actions',
            },
            trigger: null,
            categoryId: 'INTERACTIVE_CATEGORY',
        });
    };

    //------------------------------------------------------------------------------------

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log('Notification: ' + notification.request.content.title, notification.request.content.body);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    return (

        <View style={styles.container}>
            <Text>Your expo push token: {expoPushToken}</Text>
            {queries ? (<QueryList questions={queries}/>) : (<Text>Nothing</Text>)}
            <Button
                title="Press to Send Notification"
                onPress={async () => {
                    await sendPushNotification(expoPushToken);
                }}
            />
            <Button
                title="Press to Send Interactive Notification"
                onPress={async () => {
                    await handlePress(expoPushToken);
                    console.log( await getNotificationCategoriesAsync())
                }}
            />
            <Button
                title="Press to Get Queries"
                onPress={() => {
                    getQueriesFromDb()
                }}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#add8e6',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
