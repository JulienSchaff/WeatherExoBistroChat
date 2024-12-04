import React from 'react';
import {ImageBackground, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import SearchDropdown from "../components/SearchDropdown.tsx";
import {City} from "../constants/types.ts";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import {window} from '../constants/sizes.ts';

type DataType = {
    key: any;
    value: string;
}

const goToHomeScreen = (navigation: any, cityList: City[]) => {
    navigation.navigate('HomeScreen', {cityList: cityList})
}

const CityListScreen = ({navigation, route}: any) => {
    const {selectedCities} = route.params;

    const [selectedCitiesCopy, setSelectedCitiesCopy] = React.useState<City[]>(selectedCities);

    const city_list = require("../data/city_list.json")

    const data = city_list.map((city: any) => {
        return {
            key: city.id,
            value: `${city.city}, ${city.country}`
        }
    })

    const image = require("../assets/images/city.jpg");

    const handleSelectItem = (item: DataType) => {
        const city = city_list.find((city: City) => `${city.city}, ${city.country}` === item.value);
        if (city) {
            if (selectedCitiesCopy.find((selectedCity: City) => selectedCity.id === city.id)) {
                return;
            }
            setSelectedCitiesCopy([...selectedCitiesCopy, city]);
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={image}
                resizeMode="cover"
                blurRadius={5}
                imageStyle={{opacity: 0.8}}
                style={styles.imageBackground}
            >
                <View style={styles.topButtons}>
                    <FontAwesome6Icon.Button
                        testID="back-button"
                        name="arrow-left"
                        backgroundColor="#ffffff00"
                        underlayColor={"#ffffff11"}
                        borderRadius={50}
                        size={24}
                        style={{marginHorizontal: 5}}
                        iconStyle={{marginRight: 0}}
                        onPress={() => goToHomeScreen(navigation, selectedCitiesCopy)}
                    />
                </View>
                <View style={styles.content}>
                    <View style={styles.selectContainer}>
                        <SearchDropdown data={data} onSelectItem={handleSelectItem}/>
                    </View>
                    <View style={styles.listContainer}>
                        <ScrollView>
                            {selectedCitiesCopy.map((city: City) => {
                                return (
                                    <View key={city.id} style={styles.cityItem}>
                                        <Text testID={`selected-city-${city.city}, ${city.country}`}
                                              style={styles.textItem}>{city.city}, {city.country}</Text>
                                        <FontAwesome6Icon.Button testID={`remove-city-${city.city}, ${city.country}`}
                                                                 style={styles.icon} name={"trash-can"} size={16}
                                                                 backgroundColor={"transparent"} borderRadius={50}
                                                                 color={"white"} onPress={() => {
                                            const newSelectedCities = selectedCitiesCopy.filter((selectedCity: City) => selectedCity.id !== city.id);
                                            setSelectedCitiesCopy(newSelectedCities);
                                        }
                                        }/>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {flex: 1, height: window.height, width: window.width, position: "absolute"},
    content: {
        flex: 1,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
    },
    imageBackground: {
        backgroundColor: "gray",
        flex: 1,
        justifyContent: "center",
        paddingTop: StatusBar.currentHeight,
        alignItems: "center"
    },
    topButtons: {
        position: "absolute",
        top: 0,
        left: 0,
        marginTop: StatusBar.currentHeight,
        marginLeft: 16,
    },
    selectContainer: {
        paddingHorizontal: 24,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 16,
        width: "100%",
        height: "40%",
        display: "flex",
        paddingTop: 32,
    },
    listContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 16,
        width: "100%",
        height: "40%",
        marginTop: 16,
        padding: 16,
    },
    cityItem: {
        padding: 8,
        marginVertical: 5,
        borderRadius: 8,
        flexDirection: "row",
        flex: 1,
        alignItems: "flex-start",
        textAlign: "center",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
    textItem: {
        paddingLeft: 16,
        alignItems: 'center',
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        height: "100%",
        width: "87%",
    },
    icon: {
        marginVertical: -5,
    }
});


export default CityListScreen;