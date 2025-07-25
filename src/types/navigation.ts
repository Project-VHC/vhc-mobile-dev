// // src/types/navigation.d.ts (or navigation.ts)
//
// import { NavigatorScreenParams } from '@react-navigation/native';
//
// // Define the types for your root stack navigator
// // 'RootStackParamList' is a common name, adjust if you have a different naming convention
// export type RootStackParamList = {
//     // Define each screen and its expected parameters
//     // If a screen has no parameters, you can use 'undefined'
//     Home: undefined;
//     FindDoctor: { speciality?: string }; // 'FindDoctor' is the screen where your current code is
//     DoctorProfile: { doctor: Doctor }; // This is the screen you're trying to navigate to
//     // Add other screens in your app here, e.g.:
//     // Login: undefined;
//     // Settings: { userId: string };
// };
//
// // This declaration helps TypeScript understand your navigation structure globally
// declare global {
//     namespace ReactNavigation {
//         interface RootParamList extends RootStackParamList {}
//     }
// }