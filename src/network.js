import { Platform } from 'react-native';
import CONFIG from "../config.json";

export const getIPAddress = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Device is running on a physical device or simulator/emulator
        return 'http://' + CONFIG.localIp + ':3000';
        // App is running in a browser
        return 'http://172.22.240.1:3000'
    }
};
