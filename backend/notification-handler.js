/**
 *
 * @param expoPushToken
 * @param msg
 * @param category
 * @returns {Promise<void>}
 */
async function sendPushNotification(expoPushToken, msg, category) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'New Query!',
        body: 'How are you feeling today?',
        data: { someData: 'goes here' },
        categoryId: category? category : null,
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

async function sendPushQuery(expoPushToken, query) {

    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'New Query!',
        body: query,
        // body: query?.question,
        data: { query_id: query },
        // data: { query_id: query?.id },
        categoryId: 'INTERACTIVE_CATEGORY'
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

exports.sendPushQuery = sendPushQuery;
