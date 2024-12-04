import * as React from "react";
import {
    ActivityIndicator,
    ImageBackground,
    StatusBar,
    StyleSheet,
    View
} from "react-native";
import Carousel, {ICarouselInstance} from "react-native-reanimated-carousel";
import Icon from 'react-native-vector-icons/FontAwesome6'

import {renderWeatherInfoComponent} from "../components/WeatherInfoComponent.tsx";
import {window} from "../constants/sizes.ts";
import {createRef, useEffect, useState} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {cityImage, getBackgroundFromCode, WeatherIconCode} from "../constants/weather-icons.ts";

import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from 'react-native-reanimated';
import {City} from "../constants/types.ts";
import {getApiKey, getWeatherFromCityList} from "../utils/openweather.ts";
import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "../../index";
import {doc, getDoc, updateDoc} from "@react-native-firebase/firestore";

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // To hide some warnings
});

const data = [] as any[];

const ref = createRef<ICarouselInstance>()

const userProfile = (navigation: any) => {
    navigation.navigate('ProfileScreen')
}

const goToCityListScreen = async (navigation: any, userDocRef: any) => {
    const userDoc = await getDoc(userDocRef);

    if (!userDoc || !userDoc.exists) {
        return;
    }

    // We use ts-ignore here because it would be too long to write the whole type for now
    // @ts-ignore
    const selectedCities = userDoc.data().cityList || [] as City[];

    navigation.navigate('CityListScreen', {selectedCities})
}

const HomeScreen = ({navigation, route}: any) => {
    const {cityList} = route.params;

    const [loading, setLoading] = React.useState<boolean>(false);

    const user = FIREBASE_AUTH.currentUser;

    const userDocRef = doc(FIREBASE_FIRESTORE, "users", user!.uid);

    const [weatherInfo, setWeatherInfo] = useState(data);

    const [imageSource, setImageSource] = useState(
        weatherInfo.length > 0 ? getBackgroundFromCode(weatherInfo[0].weather.icon as WeatherIconCode)
            : cityImage
    );

    const refreshData = async (userDocRef: any, cityList: City[]) => {
        setLoading(true);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc || !userDoc.exists) {
            return;
        }

        // We use ts-ignore here because it would be too long to write the whole type for now
        // @ts-ignore
        let dbCityList = userDoc.data().cityList || [] as City[];

        if (cityList && cityList.length > 0 && JSON.stringify(dbCityList) !== JSON.stringify(cityList)) {
            updateDoc(userDocRef, {cityList: cityList}).then();
            dbCityList = cityList;
        }

        const apiKey = await getApiKey();

        const infos = await getWeatherFromCityList(dbCityList, apiKey);

        setWeatherInfo(infos);
        setImageSource(getBackgroundFromCode(
            infos.length > 0 ? infos[0].weather.icon as WeatherIconCode : "01d"
        ));

        setLoading(false);
    }

    useEffect(() => {
        refreshData(userDocRef, cityList).then();
    }, [navigation]);

    return (
        <View
            style={styles.container}>
            <ImageBackground
                testID="image-background"
                source={imageSource}
                resizeMode="cover"
                blurRadius={5}
                imageStyle={{opacity: 0.8}}
                style={{
                    backgroundColor: "gray",
                    flex: 1,
                    justifyContent: "center",
                    paddingTop: StatusBar.currentHeight
                }}
            >
                <View testID="top-buttons" style={styles.topButtons}>
                    <View>
                        <Icon.Button
                            testID="refresh-button"
                            name="arrows-rotate"
                            backgroundColor="#ffffff00"
                            underlayColor={"#ffffff11"}
                            borderRadius={50}
                            size={24}
                            style={{marginHorizontal: 5}}
                            iconStyle={{marginRight: 0}}
                            onPress={() =>
                                refreshData(userDocRef, cityList).then()
                            }
                        />
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <Icon.Button
                            testID="map-location-button"
                            name="map-location"
                            backgroundColor="#ffffff00"
                            underlayColor={"#ffffff11"}
                            borderRadius={50}
                            size={24}
                            style={{marginHorizontal: 5}}
                            iconStyle={{marginRight: 0}}
                            onPress={() => goToCityListScreen(navigation, userDocRef)}
                        />
                        <Icon.Button
                            testID="user-profile-button"
                            name="user-large"
                            backgroundColor="#ffffff00"
                            underlayColor={"#ffffff11"}
                            borderRadius={50}
                            size={24}
                            style={{marginHorizontal: 5}}
                            iconStyle={{marginRight: 0}}
                            onPress={() => userProfile(navigation)}
                        />
                    </View>
                </View>
                {loading ? (<ActivityIndicator testID="loading-indicator" size="large" color={"white"}
                                               style={{width: window.width}}/>)
                    : (
                        <GestureHandlerRootView>
                            <Carousel
                                testID="weather-carousel"
                                ref={ref}
                                data={weatherInfo}
                                vertical={false}
                                height={window.height}
                                width={window.width}
                                renderItem={renderWeatherInfoComponent(weatherInfo)}
                                onScrollEnd={(index) => {
                                    const image = getBackgroundFromCode(weatherInfo[index].weather.icon as WeatherIconCode);
                                    setImageSource(image);
                                }}
                                panGestureHandlerProps={{
                                    activeOffsetX: [-50, 50],
                                }}
                            />
                        </GestureHandlerRootView>
                    )}
            </ImageBackground>
        </View>
    );
}

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
        justifyContent: "center",
        paddingTop: StatusBar.currentHeight
    },
    topButtons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "absolute",
        paddingTop: StatusBar.currentHeight,
        width: "100%",
        paddingHorizontal: 12,
        top: 10,
        zIndex: 1000,
    }
})

export default HomeScreen;