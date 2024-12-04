import {
    ImageBackground,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {FIREBASE_AUTH} from "../../index";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import React from "react";
import {cityImage} from "../constants/weather-icons.ts";

const goToHomeScreen = (navigation: any) => {
    navigation.navigate('HomeScreen', {cityList: []})
}

const ProfileScreen = ({navigation, route}: any) => {

    const image = cityImage;

    const user = FIREBASE_AUTH.currentUser;

    return <View
        testID="profile-screen"
        style={styles.container}>
        <ImageBackground
            source={image}
            resizeMode="cover"
            blurRadius={5}
            imageStyle={{opacity: 0.8}}
            style={styles.imageBackground}
        >
            <View testID="top-button" style={styles.topButtons}>
                <FontAwesome6Icon.Button
                    testID="back-button"
                    name="arrow-left"
                    backgroundColor="#ffffff00"
                    underlayColor={"#ffffff11"}
                    borderRadius={50}
                    size={24}
                    style={{marginHorizontal: 5}}
                    iconStyle={{marginRight: 0}}
                    onPress={() => goToHomeScreen(navigation)}
                />
            </View>
            <View testID="content-container" style={styles.content}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <FontAwesome6Icon name={"user"} size={50} color={"white"}/>
                    <Text testID="user-email" style={styles.text}>{user?.email}</Text>
                </View>
                <View testID="button-container" style={styles.buttonContainer}>
                    <Pressable
                        testID="sign-out-button"
                        onPress={() => FIREBASE_AUTH.signOut()}
                        style={({pressed}) => [
                            styles.button,
                            {
                                backgroundColor: pressed ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)",
                            }
                        ]}>
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </Pressable>
                </View>
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
    topButtons: {
        position: "absolute",
        top: 0,
        left: 0,
        marginTop: StatusBar.currentHeight,
        marginLeft: 16,
    },
    content: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 16,
        width: "90%",
        height: 300,
        marginTop: 16,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContainer: {
        height: "40%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        marginTop: 20,
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        marginVertical: 5,
        borderRadius: 8,
        width: "60%",
        height: "60%",
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


export default ProfileScreen;