import { City } from "../constants/types.ts";
import { doc, getDoc } from "@react-native-firebase/firestore";
import { FIREBASE_FIRESTORE } from "../../index";
import { format } from "date-fns-tz";
import * as RNLocalize from "react-native-localize";
import { addSeconds } from "date-fns";
import axios from "axios";

export const getApiKey = async () => {

    const apiKeyDocRef = doc(FIREBASE_FIRESTORE, "openweathermap", "openweathermapApiKey");

    try {
        const ApiKeyDoc = await getDoc(apiKeyDocRef);

        return ApiKeyDoc.data()!.apiKey;
    } catch (e) {
        return;
    }

}

const getWeather = async (city: City, lat: number, long: number, apiKey: string) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    if (response.status !== 200) {
        return;
    }

    return {
        cityId: city.id,
        cityName: city.city,
        data: response.data
    }
}

const formatSun = (date: number, timezone: number) => {
    const zonedDate = addSeconds(new Date(date * 1000), timezone);
    return zonedDate.getUTCHours().toString().padStart(2, '0') + ":" + zonedDate.getUTCMinutes();
}

const formatDT = (date: number) => {
    return format(date * 1000, "dd/MM/yyyy HH:mm", { timeZone: RNLocalize.getTimeZone() });
}

const formatWeatherInfo = (responses: any[]) => {
    const infos: any[] = []

    responses.forEach(response => {
        infos.push({
            city_name: response.cityName,
            weather: {
                main: response.data.weather[0].main,
                icon: response.data.weather[0].icon
            },
            temperature: Math.round(response.data.main.temp),
            temp_min: Math.round(response.data.main.temp_min),
            temp_max: Math.round(response.data.main.temp_max),
            feels_like: Math.round(response.data.main.feels_like),
            wind: response.data.wind.speed,
            humidity: response.data.main.humidity,
            clouds: response.data.clouds.all,
            visibility: {
                value: response.data.visibility > 1000 ? response.data.visibility / 1000 : response.data.visibility,
                unit: response.data.visibility > 1000 ? "km" : "m"
            },
            pressure: response.data.main.grnd_level,
            sunrise: formatSun(response.data.sys.sunrise, response.data.timezone),
            sunset: formatSun(response.data.sys.sunset, response.data.timezone),
            dt: formatDT(response.data.dt),
        })
    })

    return infos;
}

export const getWeatherFromCityList = async (cityList: City[], apiKey: string) => {
    const promises = cityList.map((city: City) => getWeather(city, city.lat, city.long, apiKey));
    const responses = await Promise.all(promises);

    return formatWeatherInfo(responses);
}

export { getWeather, formatSun, formatDT, formatWeatherInfo };