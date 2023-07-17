/**
 *
 * @param expoPushToken
 * @param msg
 * @returns {Promise<void>}
 */
export async function sendPushNotification(expoPushToken, msg) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'New Query!',
        body: 'How are you feeling today?',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

