import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewProps
} from "react-native";
import { CarouselRenderItem } from "react-native-reanimated-carousel";
import React from "react";
import { getIconFromCode, WeatherIconCode } from "../constants/weather-icons.ts";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { window } from "../constants/sizes.ts";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface ItemProps extends AnimatedProps<ViewProps> {
  index?: number;
  data?: any;
  testID?: string;
}

const OtherInfo =
  (props: {
    icon: string,
    type: string,
    info: string,
    unit: string
  }
  ) => {
    return (
      <View
          testID={`OtherInfo-${props.type}`}
          style={[styles.overlayTextContainer,
      {
        width: "48%",
        aspectRatio: 1.3,
        paddingHorizontal: 12,
      }]}>
        <View style={styles.other_info}>
          <View style={{ flex: 2, alignItems: "center" }}>
            <FontAwesome6Icon name={props.icon} size={24} color={"white"} />
          </View>
          <View style={{ flex: 3, justifyContent: "space-evenly", height: "100%" }}>
            <Text style={styles.other_info_text} adjustsFontSizeToFit={true} numberOfLines={1}>
              {props.type}
            </Text>
            <Text style={[styles.other_info_text, { fontSize: 20 }]} adjustsFontSizeToFit={true} numberOfLines={1}>
              {props.info} {props.unit}
            </Text>
          </View>
        </View>
      </View>
    )
  }


const WeatherInfoComponent: React.FC<ItemProps> = (props) => {
  const { index = 0, data, testID, ...animatedViewProps } = props;

  if (data && (data.length > 0)) {
    return (
      <Animated.View testID={testID || "WeatherInfoComponent"} style={{ flex: 1, backgroundColor: "transparent" }} {...animatedViewProps}>
        <View style={styles.overlay}>
          <View style={styles.overlayContainer}>
            <View
                testID="CityNameContainer"
                style={
              [
                styles.overlayTextContainer,
                { width: "100%" }
              ]
            }>
              <Text style={styles.overlayText}>
                {data[index].city_name}
              </Text>
            </View>
            <ScrollView
              testID="WeatherInfoScrollView"
              style={styles.overlayScrollView}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              <View
                  testID="WeatherDetailsContainer"
                  style={[styles.overlayTextContainer, { width: "100%", height: window.height * 0.3 }]}>
                <View style={styles.weather}>
                  <View style={{ flex: 1, width: "100%" }}>
                    <MaterialCommunityIcons
                      name={getIconFromCode(data[index].weather.icon as WeatherIconCode)}
                      style={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        textAlignVertical: "center",
                        fontSize: 100,
                      }}
                      adjustsFontSizeToFit={true}
                      color={"white"} />
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ color: "white", fontSize: 10, fontWeight: "ultralight" }}>{data[index].dt}</Text>
                  </View>
                  <View style={{ flex: 1, height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.temperature} adjustsFontSizeToFit={true} numberOfLines={1}>
                      {data[index].temperature}°C
                    </Text>
                    <Text style={styles.temperature_min_max}>
                      {data[index].temp_min}°C / {data[index].temp_max}°C
                    </Text>
                    <Text style={styles.weatherText} adjustsFontSizeToFit={true} numberOfLines={1}>
                      {data[index].weather.main}
                    </Text>
                  </View>
                </View>

              </View>
              <View style={styles.content}>
                <OtherInfo icon={"temperature-half"} type={"Feels like"} info={data[index].feels_like} unit={"°C"} />
                <OtherInfo icon={"wind"} type={"Wind"} info={data[index].wind} unit={"m/s"} />
                <OtherInfo icon={"droplet"} type={"Humidity"} info={data[index].humidity} unit={"%"} />
                <OtherInfo icon={"cloud"} type={"Clouds"} info={data[index].clouds} unit={"%"} />
                <OtherInfo icon={"eye"} type={"Visibility"} info={data[index].visibility.value} unit={data[index].visibility.unit} />
                <OtherInfo icon={"gauge-high"} type={"Air pressure"} info={data[index].pressure} unit={"hPa"} />
                <View testID="SunsetSunriseContainer" style={[styles.overlayTextContainer, { width: "100%", aspectRatio: 2 }]}>
                  <View style={styles.sunset_sunrise}>
                    <View testID="SunriseContainer" style={{ height: "100%", width: "50%", justifyContent: "center", alignItems: "center" }}>
                      <Text style={styles.other_info_text}>Sunrise</Text>
                        <FeatherIcon name={"sunrise"} size={50} color={"white"} style={{marginTop: 5}} />
                        <Text adjustsFontSizeToFit={true} numberOfLines={1}
                          style={styles.sunset_sunrise_text}>{data[index].sunrise}</Text>
                    </View>
                    <View testID="SunsetContainer" style={{ height: "100%", width: "50%", justifyContent: "center", alignItems: "center" }}>
                      <Text style={styles.other_info_text}>Sunset</Text>
                        <FeatherIcon name={"sunset"} size={50} color={"white"} style={{marginTop: 5}} />
                        <Text adjustsFontSizeToFit={true} numberOfLines={1}
                          style={styles.sunset_sunrise_text}>{data[index].sunset}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Animated.View>
    );
  }
  else {
    return <View testID="EmptyWeatherInfo" />
  }
};

export const renderWeatherInfoComponent =
  (data: any): CarouselRenderItem<any> =>
    ({ index }: { index: number }) => (
      <WeatherInfoComponent key={index} index={index} data={data} />
    );

const styles = StyleSheet.create({
  overlay: {
    display: "flex",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center"
  },
  overlayScrollView: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  overlayContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: window.width * 0.95,
    height: window.height * 0.86
  },
  contentContainer: {
    display: "flex",
    alignItems: "center"
  },
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between"
  },
  overlayTextContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 6,
    borderRadius: 16,
    width: "80%",
    display: "flex",
    justifyContent: "space-evenly",
  },
  weather: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    flexDirection: 'row',
  },
  temperature: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    height: "30%",
    textAlignVertical: "center",
  },
  temperature_min_max: {
    color: "white",
    fontSize: 12,
    height: "10%",
    textAlignVertical: "center",
  },
  weatherText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    height: "40%",
    textAlignVertical: "center",
  },
  other_info: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  other_info_text: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  sunset_sunrise: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  sunset_sunrise_text: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    width: "60%",
    textAlignVertical: "center",
    textAlign: "center"
  }
});

export default WeatherInfoComponent;