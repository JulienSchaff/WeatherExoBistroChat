import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CityListScreen from '../app/screens/CityListScreen';

const mockNavigation = {
    navigate: jest.fn(),
};

const mockRoute = {
    params: {
        selectedCities: [
            { id: 1, city: 'New York', country: 'USA' },
            { id: 2, city: 'London', country: 'UK' },
        ],
    },
};

jest.mock("react-native-vector-icons/FontAwesome6", () => {
    const MockedFontAwesome6Icon = ({ name } : any) => "name";
    MockedFontAwesome6Icon.Button = ({ testID, onPress, children, name } : any) => (
        // We use ts-ignore here because the button HTML component does not actually have a testID prop
        // We do this to replace the FontAwesome6Icon.Button component with a button HTML component and still be able to test it
        // @ts-ignore
        <button testID={testID}
                name={name}
                onClick={onPress}>
            {children || "MockedButton"}
        </button>
    );
    return MockedFontAwesome6Icon;
});

describe('CityListScreen', () => {
    it('renders correctly with initial selected cities', () => {
        const { getByText } = render(
            <CityListScreen navigation={mockNavigation} route={mockRoute} />
        );

        expect(getByText('New York, USA')).toBeTruthy();
        expect(getByText('London, UK')).toBeTruthy();
    });

    it('navigates back to HomeScreen on back button press', () => {
        const { getByTestId } = render(
            <CityListScreen navigation={mockNavigation} route={mockRoute} />
        );

        fireEvent.press(getByTestId("back-button"));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('HomeScreen', {
            cityList: mockRoute.params.selectedCities,
        });
    });

    it('adds a new city when selecting from SearchDropdown', async () => {
        const { getByTestId } = render(
            <CityListScreen navigation={mockNavigation} route={mockRoute} />
        );

        const dropdownInput = getByTestId('citySearchInput');
        fireEvent.changeText(dropdownInput, 'Tokyo');

        const dropdownItem = await waitFor(() =>
            getByTestId('selectItem-Tokyo, Japan')
        );
        fireEvent.press(dropdownItem);

        expect(getByTestId('selected-city-Tokyo, Japan')).toBeTruthy();
    });

    it('removes a city from the list', async () => {
        const { getByText, queryByText, getByTestId } = render(
            <CityListScreen navigation={mockNavigation} route={mockRoute} />
        );

        const deleteButton = getByTestId('remove-city-New York, USA');
        fireEvent.press(deleteButton);

        await waitFor(() => {
            expect(queryByText('New York, USA')).toBeNull();
        });

        expect(getByText('London, UK')).toBeTruthy();
    });
});
