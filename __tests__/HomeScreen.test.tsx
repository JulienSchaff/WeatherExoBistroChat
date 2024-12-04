import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../app/screens/HomeScreen';
import { getApiKey, getWeatherFromCityList} from "../app/utils/openweather.ts";

jest.mock('@react-navigation/native-stack', () => {
    return {
        createNativeStackNavigator: jest.fn(() => ({
            Navigator: jest.fn(),
            Screen: jest.fn(),
        })),
    };
});

jest.mock('../app/utils/openweather', () => {
    return {
        getApiKey: jest.fn(),
        getWeatherFromCityList: jest.fn(),
    };
});

jest.mock("@react-native-firebase/auth", () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("../index", () => ({
    FIREBASE_AUTH: {
        currentUser: { uid: 'test-user-id' },
    },
    FIREBASE_FIRESTORE: {},
}));

jest.mock('react-native-localize', () => ({
    getTimeZone: () => 'Europe/Paris',
}));

import * as RNLocalize from 'react-native-localize';
import {doc, getDoc, updateDoc} from "@react-native-firebase/firestore";

jest.mock("react-native-vector-icons/FontAwesome6", () => {
    const MockedFontAwesome6Icon = ({ name } : any) => `MockedIcon-${name}`;
    MockedFontAwesome6Icon.Button = ({ testID, onPress, children } : any) => (
        // We use ts-ignore here because the button HTML component does not actually have a testID prop
        // We do this to replace the FontAwesome6Icon.Button component with a button HTML component and still be able to test it
        // @ts-ignore
        <button testID={testID}
                onClick={onPress}>
            {children || "MockedButton"}
        </button>
    );
    return MockedFontAwesome6Icon;
});

const mockNavigation = { navigate: jest.fn() };

const mockRoute = {
    params: {
        cityList: [],
    },
};

jest.mock("@react-native-firebase/firestore", () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
}));

describe('HomeScreen', () => {
    const mockUserDoc = {
        exists: true,
        data: () => ({
            cityList: [
                { city: 'Paris', country: 'France', id: 1928, lat: 48.969, long: 2.441 },
                { city: 'Toronto', country: 'Canada', id: 89, lat: 43.862, long: -79.37 },
                { city: 'Hong Kong', country: 'Hong Kong', id: 3835, lat: 22.309, long: 113.914 },
            ],
        }),
    };

    const mockedDoc = doc as jest.Mock;
    mockedDoc.mockReturnValue({
        id: 'test-user-id',
    });

    const mockedGetDoc = getDoc as jest.Mock;
    mockedGetDoc.mockResolvedValue(mockUserDoc);

    const mockedUpdateDoc = updateDoc as jest.Mock;
    mockedUpdateDoc.mockResolvedValue({});

    const mockedGetApiKey = getApiKey as jest.Mock;
    mockedGetApiKey.mockResolvedValue('dummy-api-key');

    const mockedGetWeatherFromCityList = getWeatherFromCityList as jest.Mock;
    mockedGetWeatherFromCityList.mockResolvedValue([
        {
            city_name: 'Paris',
            weather: { main: 'Clear', icon: '01d' },
            temperature: 18,
            temp_min: 15,
            temp_max: 21,
            feels_like: 17,
            wind: 5,
            humidity: 65,
            clouds: 0,
            visibility: { value: 10, unit: 'km' },
            pressure: 1012,
            sunrise: '06:30',
            sunset: '18:45',
            dt: '04/12/2024 12:00',
        },
        {
            city_name: 'Toronto',
            weather: { main: 'Cloudy', icon: '02d' },
            temperature: 22,
            temp_min: 18,
            temp_max: 24,
            feels_like: 20,
            wind: 6,
            humidity: 70,
            clouds: 40,
            visibility: { value: 8, unit: 'km' },
            pressure: 1015,
            sunrise: '07:00',
            sunset: '17:45',
            dt: '04/12/2024 12:00',
        },
        {
            city_name: 'Hong Kong',
            weather: { main: 'Rain', icon: '09d' },
            temperature: 27,
            temp_min: 25,
            temp_max: 29,
            feels_like: 28,
            wind: 4,
            humidity: 90,
            clouds: 80,
            visibility: { value: 5, unit: 'km' },
            pressure: 1010,
            sunrise: '06:15',
            sunset: '18:30',
            dt: '04/12/2024 12:00',
        },
    ]);

    it('should fetch user data and show cities correctly', async () => {
        const { getByTestId, queryByText } = render(
            <HomeScreen navigation={mockNavigation} route={mockRoute} />
        );

        expect(getByTestId('loading-indicator')).toBeTruthy();

        await waitFor(() => {
            expect(queryByText('Paris')).toBeTruthy();
            expect(queryByText('Toronto')).toBeTruthy();
            expect(queryByText('Hong Kong')).toBeTruthy();
        });
    });

    it('should navigate to CityListScreen when map location button is pressed', async () => {
        const { getByTestId } = render(
            <HomeScreen navigation={mockNavigation} route={mockRoute}/>
        );

        const mapLocationButton = getByTestId('map-location-button');
        fireEvent.press(mapLocationButton);

        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalledWith('CityListScreen', { selectedCities: [
                    { city: 'Paris', country: 'France', id: 1928, lat: 48.969, long: 2.441 },
                    { city: 'Toronto', country: 'Canada', id: 89, lat: 43.862, long: -79.37 },
                    { city: 'Hong Kong', country: 'Hong Kong', id: 3835, lat: 22.309, long: 113.914 },
                ] });
        });
    });

    it('should navigate to ProfileScreen when user button is pressed', async () => {
        const { getByTestId } = render(
            <HomeScreen navigation={mockNavigation} route={mockRoute} />
        );

        const userButton = getByTestId('user-profile-button');
        fireEvent.press(userButton);

        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfileScreen');
        });
    });

    it('should display weather info correctly when data is fetched', async () => {
        const { queryByText } = render(
            <HomeScreen navigation={mockNavigation} route={mockRoute} />
        );

        await waitFor(() => {
            expect(queryByText('Paris')).toBeTruthy();
            expect(queryByText('Toronto')).toBeTruthy();
            expect(queryByText('Hong Kong')).toBeTruthy();
        });
    });
});