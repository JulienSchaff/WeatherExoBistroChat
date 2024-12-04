/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from "./app/App";
import {name as appName} from './app.json';

import {initializeApp} from "@react-native-firebase/app";
import {getAuth} from "@react-native-firebase/auth";
import {getFirestore} from "@react-native-firebase/firestore";

export const FIREBASE_APP = initializeApp();
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);

AppRegistry.registerComponent(appName, () => App);
