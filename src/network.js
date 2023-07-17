import { Platform } from 'react-native';

export const getIPAddress = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Device is running on a physical device or simulator/emulator
        return 'http://192.168.0.247:3000'; // Replace with the logic to retrieve the device's private IP address
    } else {
        // App is running in a browser
        return 'http://172.22.240.1:3000'; // Replace with the logic to retrieve the public IP address of the server hosting the app
    }
};
