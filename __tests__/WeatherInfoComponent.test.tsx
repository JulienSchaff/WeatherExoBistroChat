import React from "react";
import { render } from "@testing-library/react-native";
import WeatherInfoComponent from "../app/components/WeatherInfoComponent.tsx";

const mockData = [
    {
        city_name: "Paris",
        weather: { icon: "09d", main: "Drizzle" },
        temperature: 15,
        temp_min: 10,
        temp_max: 20,
        feels_like: 14,
        wind: 5.2,
        humidity: 80,
        clouds: 90,
        visibility: { value: 10, unit: "km" },
        pressure: 1013,
        sunrise: "7:30 AM",
        sunset: "4:45 PM",
        dt: "2024-12-02 12:00",
    },
];

describe("WeatherInfoComponent", () => {
    it("renders correctly with data", () => {
        const { getByTestId } = render(
            <WeatherInfoComponent data={mockData} index={0} testID="WeatherInfoComponent" />
        );

        expect(getByTestId("WeatherInfoComponent")).toBeTruthy();

        expect(getByTestId("CityNameContainer")).toBeTruthy();

        expect(getByTestId("WeatherInfoScrollView")).toBeTruthy();

        expect(getByTestId("WeatherDetailsContainer")).toBeTruthy();

        expect(getByTestId("OtherInfo-Feels like")).toBeTruthy();
        expect(getByTestId("OtherInfo-Wind")).toBeTruthy();
        expect(getByTestId("OtherInfo-Humidity")).toBeTruthy();
        expect(getByTestId("OtherInfo-Clouds")).toBeTruthy();
        expect(getByTestId("OtherInfo-Visibility")).toBeTruthy();
        expect(getByTestId("OtherInfo-Air pressure")).toBeTruthy();

        expect(getByTestId("SunsetSunriseContainer")).toBeTruthy();
        expect(getByTestId("SunriseContainer")).toBeTruthy();
        expect(getByTestId("SunsetContainer")).toBeTruthy();
    });

    it("renders empty state when no data is provided", () => {
        const { getByTestId } = render(<WeatherInfoComponent data={[]} />);

        expect(getByTestId("EmptyWeatherInfo")).toBeTruthy();
    });

    it("renders the correct city name and temperature", () => {
        const { getByText } = render(
            <WeatherInfoComponent data={mockData} index={0} testID="WeatherInfoComponent" />
        );

        expect(getByText("Paris")).toBeTruthy();

        expect(getByText("15°C")).toBeTruthy();

        expect(getByText("10°C / 20°C")).toBeTruthy();

        expect(getByText("Drizzle")).toBeTruthy();
    });

    it("renders sunrise and sunset times", () => {
        const { getByText } = render(
            <WeatherInfoComponent data={mockData} index={0} testID="WeatherInfoComponent" />
        );

        expect(getByText("7:30 AM")).toBeTruthy();
        expect(getByText("4:45 PM")).toBeTruthy();
    });
});