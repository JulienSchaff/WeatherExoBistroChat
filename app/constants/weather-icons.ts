export const WEATHER_BACKGROUNDS = {
    "01d": require("../assets/images/weather-backgrounds/01d.jpg"),
    "01n": require("../assets/images/weather-backgrounds/01n.jpg"),
    "02d": require("../assets/images/weather-backgrounds/02d.jpg"),
    "02n": require("../assets/images/weather-backgrounds/02n.jpg"),
    "03d": require("../assets/images/weather-backgrounds/03d.jpg"),
    "03n": require("../assets/images/weather-backgrounds/03n.jpg"),
    "04d": require("../assets/images/weather-backgrounds/04d.jpg"),
    "04n": require("../assets/images/weather-backgrounds/04n.jpg"),
    "09d": require("../assets/images/weather-backgrounds/09d.jpg"),
    "09n": require("../assets/images/weather-backgrounds/09n.jpg"),
    "10d": require("../assets/images/weather-backgrounds/10d.jpg"),
    "10n": require("../assets/images/weather-backgrounds/10n.jpg"),
    "11d": require("../assets/images/weather-backgrounds/11d.jpg"),
    "11n": require("../assets/images/weather-backgrounds/11n.jpg"),
    "13d": require("../assets/images/weather-backgrounds/13d.jpg"),
    "13n": require("../assets/images/weather-backgrounds/13n.jpg"),
    "50d": require("../assets/images/weather-backgrounds/50d.jpg"),
    "50n": require("../assets/images/weather-backgrounds/50n.jpg"),
}

export type WeatherIconCode = keyof typeof WEATHER_BACKGROUNDS;

export const getIconFromCode = (code: WeatherIconCode) => {
    switch (code) {
        case "01d":
            return "weather-sunny";
        case "01n":
            return "weather-night";
        case "02d":
            return "weather-partly-cloudy";
        case "02n":
            return "weather-night-partly-cloudy";
        case "03d":
            return "weather-cloudy";
        case "03n":
            return "weather-cloudy";
        case "04d":
            return "weather-windy-variant";
        case "04n":
            return "weather-windy-variant";
        case "09d":
            return "weather-pouring";
        case "09n":
            return "weather-pouring";
        case "10d":
            return "weather-rainy";
        case "10n":
            return "weather-rainy";
        case "11d":
            return "weather-lightning";
        case "11n":
            return "weather-lightning";
        case "13d":
            return "weather-snowy-heavy";
        case "13n":
            return "weather-snowy-heavy";
        case "50d":
            return "weather-fog";
        case "50n":
            return "weather-fog";
        default:
            return "weather-sunny";
    }
}

export const cityImage = require("../assets/images/city.jpg");

export const getBackgroundFromCode = (code: WeatherIconCode) => {
    return WEATHER_BACKGROUNDS[code];
}