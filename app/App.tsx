import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from "./screens/HomeScreen.tsx";
import LoginScreen from "./screens/LoginScreen.tsx";
import CityListScreen from "./screens/CityListScreen.tsx";
import ProfileScreen from "./screens/ProfileScreen.tsx";

import { StatusBar } from "react-native";
import { useEffect } from "react";

import { FirebaseAuthTypes, onAuthStateChanged } from "@react-native-firebase/auth";

import { FIREBASE_AUTH } from "../index";

const LoginStack = createNativeStackNavigator();

const Stack = createNativeStackNavigator();

const Inside = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{ cityList: [] }}
            />
            <Stack.Screen name="CityListScreen"
                component={CityListScreen}
                initialParams={{ selectedCities: [] }}
            />
            <Stack.Screen name={"ProfileScreen"} component={ProfileScreen} />
        </Stack.Navigator>
    );
};

const App = () => {
    const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user: FirebaseAuthTypes.User) => {
            setUser(user);
        })
    }, []);

    return (
        <NavigationContainer>
            <StatusBar translucent={true} backgroundColor={"transparent"} />
            <LoginStack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                {user ? (
                    <LoginStack.Screen name={"Inside"} component={Inside} />
                ) : (
                    <LoginStack.Screen name={"Login"} component={LoginScreen} />
                )}
            </LoginStack.Navigator>
        </NavigationContainer>
    )
}

export default App;
