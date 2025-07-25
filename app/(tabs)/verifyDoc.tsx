import {
    Feather, // Using Feather as it has similar icons to FiUpload, FiCamera, etc.
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraView } from "expo-camera/next";
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Define types for recent scan items
interface RecentScan {
    data: string;
    timestamp: string;
    isUrl: boolean;
}

const VerifyDocScreen: React.FC = () => {
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [scanning, setScanning] = useState<boolean>(false);
    const [redirecting, setRedirecting] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(5);
    const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
    const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        // Request camera and media library permissions on component mount
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
        })();

        // Load recent scans from AsyncStorage
        loadRecentScans();

        return () => {
            // Cleanup for countdown timer
            if (redirecting) {
                setRedirecting(false); // Stop any ongoing redirection
            }
        };
    }, []);

    // Effect for handling redirection countdown
    useEffect(() => {
        let timer: number;
        if (redirecting && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (redirecting && countdown === 0 && scannedData && isValidURL(scannedData)) {
            Linking.openURL(scannedData);
            setRedirecting(false);
            setScannedData(null); // Clear scanned data after redirection
            setCountdown(5); // Reset countdown
        }
        return () => clearInterval(timer);
    }, [redirecting, countdown, scannedData]);

    const loadRecentScans = async () => {
        try {
            const savedScans = await AsyncStorage.getItem('recentScans');
            if (savedScans) {
                setRecentScans(JSON.parse(savedScans));
            }
        } catch (e) {
            console.error('Failed to load recent scans:', e);
        }
    };

    const saveRecentScans = async (scans: RecentScan[]) => {
        try {
            await AsyncStorage.setItem('recentScans', JSON.stringify(scans));
        } catch (e) {
            console.error('Failed to save recent scans:', e);
        }
    };

    const isValidURL = (str: string): boolean => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleScanResult = (data: string) => {
        if (data) {
            setScannedData(data);
            const newScan: RecentScan = {
                data: data,
                timestamp: new Date().toLocaleString(),
                isUrl: isValidURL(data),
            };
            const updatedScans = [newScan, ...recentScans.slice(0, 4)]; // Keep last 5
            setRecentScans(updatedScans);
            saveRecentScans(updatedScans); // Persist to AsyncStorage

            if (isValidURL(data)) {
                setRedirecting(true);
                setCountdown(5); // Reset countdown for new redirection
            }
        }
        setScanning(false); // Stop scanning after a result
    };

    const startCameraScan = async () => {
        if (hasCameraPermission === null) {
            Alert.alert('Permissions not granted', 'Please grant camera permissions to scan QR codes.');
            return;
        }
        if (hasCameraPermission === false) {
            Alert.alert(
                'Camera access denied',
                'Please enable camera access in your device settings to use this feature.'
            );
            return;
        }
        setScannedData(null); // Clear previous result
        setRedirecting(false); // Stop any ongoing redirection
        setScanning(true);
    };

    const stopCameraScan = () => {
        setScanning(false);
        // In the new Camera API, just stop rendering CameraView to stop stream
    };

    const pickImageAndScan = async () => {
        if (hasMediaLibraryPermission === null) {
            Alert.alert(
                'Permissions not granted',
                'Please grant media library permissions to pick images.'
            );
            return;
        }
        if (hasMediaLibraryPermission === false) {
            Alert.alert(
                'Media Library access denied',
                'Please enable media library access in your device settings to use this feature.'
            );
            return;
        }

        setScannedData(null); // Clear previous result
        setRedirecting(false); // Stop any ongoing redirection
        setScanning(false); // Ensure camera is off

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
            base64: true, // Request base64 for jsQR
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0];
            if (selectedImage.base64) {
                // jsQR needs an ImageData object. We need to create it from base64.
                // This is complex in React Native as there's no native Canvas API like web.
                // A common approach is to use a library that handles image processing,
                // or a native module to get raw pixel data.
                // For simplicity, let's assume we can get pixel data (which is not directly from ImagePicker base64).
                // A more robust solution might involve:
                // 1. Using a canvas library for RN (e.g., 'expo-gl' with 'gl-react-native') to draw the image and then read pixels.
                // 2. Sending the base64 to a backend that can decode QR codes.
                // 3. Using a specialized RN image processing library to get raw pixel data.

                // Placeholder for actual image data processing for jsQR:
                // In a real app, you would likely need a more complex setup to get
                // ImageData.data, width, height from a base64 image in React Native.
                // For demonstration, let's simulate a success or provide a warning.

                // Example: If we could get pixel data as Uint8ClampedArray
                // const pixelData = new Uint8ClampedArray(base64Decode(selectedImage.base64));
                // const code = jsQR(pixelData, selectedImage.width, selectedImage.height);

                // Given the constraints, directly applying jsQR to base64 from ImagePicker isn't straightforward.
                // We will simulate it or log the limitation.
                Alert.alert(
                    'Image QR Scan Limitation',
                    'Direct image scanning with jsQR from picked images is complex in React Native without pixel data access. This feature needs a more advanced image processing setup (e.g., a native canvas module or sending to a server for processing). Simulating a generic result for now.'
                );
                // Simulate a successful scan for demonstration purposes
                handleScanResult('Simulated Data from Image Upload: ' + selectedImage.uri);
            } else {
                Alert.alert('Error', 'Could not get image data for scanning.');
            }
        }
    };

    const clearHistory = async () => {
        Alert.alert(
            'Clear History',
            'Are you sure you want to clear all recent scan history?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    onPress: async () => {
                        setRecentScans([]);
                        await AsyncStorage.removeItem('recentScans');
                    },
                },
            ]
        );
    };

    if (hasCameraPermission === null || hasMediaLibraryPermission === null) {
        return (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Requesting permissions...</Text>
        </View>
    );
    }

    return (
        <View style={styles.vdocPageContainer}>
            {/* Sidebar - Reimagined as a simple tab navigator at the top or bottom */}
            <View style={styles.vdocTabNavigator}>
    <TouchableOpacity
        style={[styles.vdocTabButton, activeTab === 'scan' && styles.vdocActiveTab]}
    onPress={() => setActiveTab('scan')}
>
    <Feather name="camera" size={20} color={activeTab === 'scan' ? '#3498db' : '#000'} />
    <Text
    style={[styles.vdocTabButtonText, activeTab === 'scan' && styles.vdocActiveTabTxt]}
>
    Scan
    </Text>
    </TouchableOpacity>
    <TouchableOpacity
    style={[styles.vdocTabButton, activeTab === 'history' && styles.vdocActiveTab]}
    onPress={() => setActiveTab('history')}
>
    <Feather name="clock" size={20} color={activeTab === 'history' ? '#3498db' : '#000'} />
    <Text
    style={[styles.vdocTabButtonText, activeTab === 'history' && styles.vdocActiveTabTxt]}
>
    History
    </Text>
    </TouchableOpacity>
    </View>

    <ScrollView style={styles.vdocMainContent}>
        {activeTab === 'scan' && (
            <>
                <View style={styles.vdocScannerSection}>
            <Text style={styles.vdocSectionTitle}>Scan QR Code</Text>
    <Text style={styles.vdocInstructions}>
        Scan a QR code using your camera or upload an image. If it's a URL, you'll be
    redirected in 5 seconds.
    </Text>

    <View style={styles.vdocScannerBoxContainer}>
    <TouchableOpacity
        style={styles.vdocScannerBox}
    onPress={pickImageAndScan} // Trigger image picker on box tap
        >
        {!scanning && (
        <View style={styles.vdocUploadPrompt}>
        <Feather name="upload" size={40} color="#3498db" />
    <Text style={styles.vdocUploadText}>Tap to upload image</Text>
    </View>
)}

    {scanning && hasCameraPermission === true ? (
            <CameraView
                ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        // autoFocus={Camera.Constants.AutoFocus.on} // New Camera API might not have this directly exposed like this.
        barcodeScannerSettings={{
        barcodeTypes: ['qr'],
    }}
        onBarcodeScanned={(result: { data: string; }) => {
        // This callback is triggered when a barcode is detected
        if (scanning) {
            // Ensure we only process if still actively scanning
            handleScanResult(result.data);
            // It's good practice to briefly stop scanning to prevent multiple detections
            setScanning(false);
        }
    }}
    >
        <View style={styles.vdocScannerGuide} />
    </CameraView>
    ) : (
        scanning &&
        hasCameraPermission === false && (
            <Text style={styles.cameraPermissionText}>
                Camera permission not granted.
    </Text>
    )
    )}
    </TouchableOpacity>
    </View>

    <View style={styles.vdocScannerActions}>
    <TouchableOpacity
        style={[styles.vdocScanButton, scanning && styles.vdocScanningButton]}
    onPress={scanning ? stopCameraScan : startCameraScan}
    >
    <Feather name="camera" size={20} color="white" style={styles.vdocButtonIcon} />
    <Text style={styles.vdocButtonText}>
        {scanning ? 'Stop Scanning' : 'Start Camera Scan'}
        </Text>
        </TouchableOpacity>
        </View>

    {scannedData && redirecting && (
        <View style={styles.vdocRedirectBox}>
        <Text style={styles.vdocRedirectText}>
        Redirecting in <Text style={styles.vdocCountdown}>{countdown}</Text> seconds...
            </Text>
            <Text style={styles.vdocRedirectUrl}>{scannedData}</Text>
        <TouchableOpacity
        style={styles.vdocGoNowButton}
        onPress={() => Linking.openURL(scannedData)}
    >
        <Text style={styles.vdocButtonText}>Go Now</Text>
    <Feather name="arrow-right" size={16} color="white" />
        </TouchableOpacity>
        </View>
    )}

    {scannedData && !isValidURL(scannedData) && (
        <View style={styles.vdocResultBox}>
        <Text style={styles.vdocResultLabel}>QR Code Data:</Text>
    <Text style={styles.vdocResultText}>{scannedData}</Text>
        </View>
    )}
    </View>

    <View style={styles.vdocHowItWorks}>
    <Text style={styles.vdocHowItWorksTitle}>
    <Feather name="info" size={20} /> How It Works
    </Text>
    <View style={styles.vdocSteps}>
    <View style={styles.vdocStep}>
    <View style={styles.vdocStepNumber}>
    <Text style={styles.vdocStepNumberText}>1</Text>
        </View>
        <Text style={styles.vdocStepText}>
        Position the QR code within the scanner frame or upload an image
    </Text>
    </View>
    <View style={styles.vdocStep}>
    <View style={styles.vdocStepNumber}>
    <Text style={styles.vdocStepNumberText}>2</Text>
        </View>
        <Text style={styles.vdocStepText}>
        Our scanner will automatically detect and read the QR code
    </Text>
    </View>
    <View style={styles.vdocStep}>
    <View style={styles.vdocStepNumber}>
    <Text style={styles.vdocStepNumberText}>3</Text>
        </View>
        <Text style={styles.vdocStepText}>
        View the decoded information or follow the URL if it's a link
    </Text>
    </View>
    </View>
    </View>
    </>
)}

    {activeTab === 'history' && (
        <View style={styles.vdocHistorySection}>
        <Text style={styles.vdocSectionTitle}>
        <Feather name="clock" size={20} /> Recent Scans
    </Text>
        {recentScans.length > 0 ? (
                <View style={styles.vdocScanHistory}>
                    {recentScans.map((scan, index) => (
                            <View style={styles.vdocHistoryItem} key={index}>
                        <View style={styles.vdocHistoryData}>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.vdocDataPreview}>
                            {scan.data}
                            </Text>
                            <Text style={styles.vdocScanTime}>{scan.timestamp}</Text>
                            </View>
            {scan.isUrl && (
                    <TouchableOpacity
                        style={styles.vdocHistoryAction}
                onPress={() => Linking.openURL(scan.data)}
        >
            <Text style={styles.vdocHistoryActionText}>Visit</Text>
                <Feather name="arrow-right" size={14} color="white" />
            </TouchableOpacity>
        )}
            </View>
        ))}
            </View>
        ) : (
            <Text style={styles.vdocNoHistory}>
                No recent scans. Start scanning QR codes to build your history.
        </Text>
        )}
        {recentScans.length > 0 && (
            <TouchableOpacity style={styles.vdocClearHistoryButton} onPress={clearHistory}>
        <Text style={styles.vdocButtonText}>Clear History</Text>
        </TouchableOpacity>
        )}
        </View>
    )}
    </ScrollView>
    </View>
);
};

// Styles for React Native components
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    vdocPageContainer: {
        flex: 1,
        backgroundColor: '#f5f7fa', // Light background color
    },
    vdocTabNavigator: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    vdocTabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
    },
    vdocActiveTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#3498db',
    },
    vdocTabButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    vdocActiveTabTxt: {
        color: '#3498db',
        fontWeight: 'bold',
    },
    vdocMainContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    vdocScannerSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.08,
                shadowRadius: 15,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    vdocSectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 10,
    },
    vdocInstructions: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#7f8c8d',
        fontSize: 15,
        lineHeight: 22,
    },
    vdocScannerBoxContainer: {
        height: 300,
        width: '100%',
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden', // Crucial for CameraView to be contained
    },
    vdocScannerBox: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#3498db',
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    vdocUploadPrompt: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    vdocUploadText: {
        color: '#7f8c8d',
        fontWeight: '500',
        marginTop: 10,
    },
    vdocScannerGuide: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -70 }, { translateY: -70 }], // Adjust based on width/height
        width: 140,
        height: 140,
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 10,
        // RN doesn't have direct CSS animations like @keyframes for this
        // You'd use Animated API for a pulse effect. Keeping it static for simplicity.
    },
    cameraPermissionText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
    },
    vdocScannerActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    vdocScanButton: {
        backgroundColor: '#3498db',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    vdocScanningButton: {
        backgroundColor: '#e74c3c',
    },
    vdocButtonIcon: {
        marginRight: 5,
    },
    vdocButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    vdocRedirectBox: {
        backgroundColor: '#edf2f7',
        borderRadius: 8,
        padding: 15,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#27ae60',
        alignItems: 'center',
    },
    vdocRedirectText: {
        fontSize: 16,
        color: '#2c3e50',
        marginBottom: 5,
    },
    vdocCountdown: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    vdocRedirectUrl: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f7f9fc',
        borderRadius: 4,
        width: '100%',
        textAlign: 'center',
        color: '#555',
    },
    vdocGoNowButton: {
        backgroundColor: '#27ae60',
        borderRadius: 25,
        paddingVertical: 8,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 10,
    },
    vdocResultBox: {
        backgroundColor: '#edf2f7',
        borderRadius: 8,
        padding: 15,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#3498db',
        alignItems: 'center',
    },
    vdocResultLabel: {
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 5,
    },
    vdocResultText: {
        padding: 10,
        backgroundColor: '#f7f9fc',
        borderRadius: 4,
        width: '100%',
        textAlign: 'center',
        color: '#555',
    },
    vdocHowItWorks: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.08,
                shadowRadius: 15,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    vdocHowItWorksTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    vdocSteps: {
        // In RN, flexbox defaults to column. For horizontal, use flexDirection: 'row'
        flexDirection: 'column', // Keeping it column for mobile layout
        gap: 15,
    },
    vdocStep: {
        flexDirection: 'row', // Number and text side by side
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    vdocStepNumber: {
        backgroundColor: '#3498db',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vdocStepNumberText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    vdocStepText: {
        flex: 1, // Take remaining space
        color: '#555',
        fontSize: 15,
        lineHeight: 22,
    },
    vdocHistorySection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.08,
                shadowRadius: 15,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    vdocScanHistory: {
        marginTop: 15,
    },
    vdocHistoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    vdocHistoryData: {
        flex: 1,
        marginRight: 10,
    },
    vdocDataPreview: {
        color: '#2c3e50',
        fontWeight: '500',
        fontSize: 15,
    },
    vdocScanTime: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 5,
    },
    vdocHistoryAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#3498db',
        borderRadius: 4,
    },
    vdocHistoryActionText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    vdocNoHistory: {
        textAlign: 'center',
        color: '#7f8c8d',
        marginVertical: 30,
        fontSize: 16,
    },
    vdocClearHistoryButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: 20,
        alignSelf: 'center',
    },
});

export default VerifyDocScreen;