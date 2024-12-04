import React from 'react';
import {
    ActivityIndicator,
    ImageBackground, Keyboard,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from '../../index';

import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@react-native-firebase/auth";
import {doc, getDoc, setDoc} from "@react-native-firebase/firestore";
import {cityImage} from "../constants/weather-icons.ts";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const LoginScreen = () => {
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    const image = cityImage;

    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);

        Keyboard.dismiss();

        try {
            const response = await signInWithEmailAndPassword(auth, email, password);

            const user = response.user;

            const userDocRef = doc(FIREBASE_FIRESTORE, "users", user.uid);

            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists) {
                await setDoc(userDocRef, {
                    cityList: [],
                    createdAt: new Date(),
                });
            }
        } catch (e) {
            return;
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);

        Keyboard.dismiss();

        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);

            const user = response.user;

            const userDocRef = doc(FIREBASE_FIRESTORE, "users", user.uid);

            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists) {
                await setDoc(userDocRef, {
                    cityList: [],
                    createdAt: new Date(),
                });
            }
        } catch (e) {
            return;
        } finally {
            setLoading(false);
        }
    }

    return <View
        testID="login-screen"
        style={styles.container}>
        <ImageBackground
            source={image}
            resizeMode="cover"
            blurRadius={5}
            imageStyle={{opacity: 0.8}}
            style={styles.imageBackground}
        >
            <View style={styles.content}>
                <FontAwesome6Icon name={"user"} size={50} color={"white"} style={{marginVertical: 20}}/>
                <TextInput
                    style={styles.input}
                    value={email}
                    placeholder={"Email"}
                    autoCapitalize={"none"}
                    onChangeText={(text) => setEmail(text)}
                ></TextInput>
                <TextInput
                    style={styles.input}
                    value={password}
                    placeholder={"Password"}
                    autoCapitalize={"none"}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                ></TextInput>

                {loading ? (<ActivityIndicator testID="activity-indicator" size="large" color={"white"}/>)
                    : (
                        <View style={styles.buttonContainer}>
                            <Pressable
                                onPress={signIn}
                                style={({pressed}) => [
                                    styles.button,
                                    {
                                        backgroundColor: pressed ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)",
                                    }
                                ]}>
                                <Text style={styles.buttonText}>Sign In</Text>
                            </Pressable>
                            <Pressable
                                onPress={signUp}
                                style={({pressed}) => [
                                    styles.button,
                                    {
                                        backgroundColor: pressed ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)",
                                    }
                                ]}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </Pressable>
                        </View>
                    )
                }
            </View>
        </ImageBackground>
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    imageBackground: {
        backgroundColor: "gray",
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: StatusBar.currentHeight
    },
    content: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 16,
        width: "90%",
        height: 400,
        marginTop: 16,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        marginVertical: 5,
        width: "90%",
        height: "15%",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        color: "white",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
    buttonContainer: {
        height: "32%",
        width: "100%",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        marginVertical: 5,
        borderRadius: 8,
        width: "60%",
        flex: 1,
    },
    buttonText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    }
})


export default LoginScreen;