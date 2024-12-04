import axios from 'axios';
import { format } from 'date-fns-tz';

jest.mock('axios');
jest.mock('@react-native-firebase/firestore', () => ({
    doc: undefined,
    getDoc: undefined,
}));
jest.mock('../index', () => ({
    FIREBASE_FIRESTORE: {},
}));
jest.mock('react-native-localize', () => ({
    getTimeZone: () => 'Europe/Paris',
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import * as RNLocalize from 'react-native-localize';
import { formatSun, formatDT, formatWeatherInfo, getWeatherFromCityList } from '../app/utils/openweather.ts';

describe('Weather Utils', () => {

    describe('formatSun', () => {
        it('should correctly format sunrise and sunset times', () => {
            const timestamp = 1696185600; // GMT: Sunday 1 October 2023 18:40:00
            const timezoneOffset = 3600; // GMT+1
            const formattedTime = formatSun(timestamp, timezoneOffset);

            expect(formattedTime).toBe('19:40');
        });
    });

    describe('formatDT', () => {
        it('should correctly format a date in the local timezone', () => {
            const timestamp = 1696185600; // Sunday 1 October 2023 18:40:00
            jest.spyOn(RNLocalize, 'getTimeZone').mockReturnValue('America/New_York');
            const formattedDate = formatDT(timestamp);

            const expectedDate = format(timestamp * 1000, 'dd/MM/yyyy HH:mm', { timeZone: 'America/New_York' });
            expect(formattedDate).toBe(expectedDate);
        });
    });

    describe('formatWeatherInfo', () => {
        it('should format the weather information correctly', () => {
            const mockResponses = [
                {
                    cityName: 'Paris',
                    data: {
                        weather: [{ main: 'Clouds', icon: '03d' }],
                        main: { temp: 20, temp_min: 15, temp_max: 25, feels_like: 18, grnd_level: 1015 },
                        wind: { speed: 5 },
                        clouds: { all: 75 },
                        visibility: 8000,
                        sys: {
                            sunrise: 1696185600, // GMT: Sunday 1 October 2023 18:40:00 (sunrise given in UTC)
                            sunset: 1696228800 // GMT: Monday 2 October 2023 06:40:00 (sunset given in UTC)
                        },
                        dt: 1696185600, // Paris: : dimanche 1 octobre 2023 20:40:00 GMT+02:00 DST (dt given in local time)
                        timezone: 3600, // GMT+1 (Paris)
                    },
                },
            ];

            jest.spyOn(RNLocalize, 'getTimeZone').mockReturnValue('Europe/Paris');

            const formattedInfo = formatWeatherInfo(mockResponses);

            expect(formattedInfo).toEqual([
                {
                    city_name: 'Paris',
                    weather: { main: 'Clouds', icon: '03d' },
                    temperature: 20,
                    temp_min: 15,
                    temp_max: 25,
                    feels_like: 18,
                    wind: 5,
                    humidity: undefined,
                    clouds: 75,
                    visibility: { value: 8, unit: 'km' },
                    pressure: 1015,
                    sunrise: '19:40', // Paris: 19:40 (in local time)
                    sunset: '07:40', // Paris: 07:40 (in local time)
                    dt: '01/10/2023 20:40', // Paris: 01/10/2023 20:40 (in local time)
                },
            ]);
        });
    });

    describe('getWeatherFromCityList', () => {
        it('should fetch and format weather data for a list of cities', async () => {
            const cityList = [
                { id: 1, city: 'Paris', country: 'FR', lat: 48.8566, long: 2.3522 },
            ];

            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: {
                    weather: [{ main: 'Clouds', icon: '03d' }],
                    main: { temp: 20, temp_min: 15, temp_max: 25, feels_like: 18, grnd_level: 1015 },
                    wind: { speed: 5 },
                    clouds: { all: 75 },
                    visibility: 8000,
                    sys: {
                        sunrise: 1696185600, // GMT: Sunday 1 October 2023 18:40:00 (sunrise given in UTC)
                        sunset: 1696228800 // GMT: Monday 2 October 2023 06:40:00 (sunset given in UTC)
                    },
                    dt: 1696185600, // Paris: : dimanche 1 octobre 2023 20:40:00 GMT+02:00 DST (dt given in local time)
                    timezone: 3600, // GMT+1 (Paris)
                },
            });

            const apiKey = 'testApiKey';
            const result = await getWeatherFromCityList(cityList, apiKey);

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `https://api.openweathermap.org/data/2.5/weather?lat=48.8566&lon=2.3522&appid=testApiKey&units=metric`
            );

            expect(result).toEqual([
                {
                    city_name: 'Paris',
                    weather: { main: 'Clouds', icon: '03d' },
                    temperature: 20,
                    temp_min: 15,
                    temp_max: 25,
                    feels_like: 18,
                    wind: 5,
                    humidity: undefined,
                    clouds: 75,
                    visibility: { value: 8, unit: 'km' },
                    pressure: 1015,
                    sunrise: '19:40', // Paris: 19:40 (in local time)
                    sunset: '07:40', // Paris: 07:40 (in local time)
                    dt: '01/10/2023 20:40', // Paris: 01/10/2023 20:40 (in local time)
                },
            ]);
        });
    });
});
