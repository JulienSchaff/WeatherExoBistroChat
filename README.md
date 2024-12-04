# WeatherExoBistroChat

By Julien Schaffauser, for BistroChat.

## Subject

Create a React Native app using TypeScript (don’t use Expo) that integrates with a third-party API (e.g.,
OpenWeatherMap) to display real-time weather data. The app should include:

1. User Authentication: Implement a secure login system.
2. Dynamic Theming: Change the app's theme based on the weather data.
3. Can add and save multiple locations and swipe to navigate between locations (
   use https://github.com/dohooo/react-native-reanimated-carousel)
4. Unit Tests: Write unit tests for your components using
   Jest (https://blog.logrocket.com/guide-unit-testing-react-native/).

## Installation

After cloning the repository, you should only need the following command to install the dependencies :

```bash
npm install
```

## Usage

Unfortunately, as it was done on Windows, the iOS version of the app was not tested.
This means there is no guarantee that it works on iOS, and it most likely doesn't.
However, you can run the Android version with the following command :

```bash
npm start --reset-cache
```

And then, on the Metro console, you can press `a` to run the app on an Android emulator or device.

## Unit Tests

The unit tests are located in the `__tests__` folder.

To run the tests, you can use the following command :

```bash
npm test
```

## General structure

The app is divided into 4 main screens :

- LoginScreen : The user can log in or create an account.
- HomeScreen : The main screen of the app, where the user can see the weather of the selected cities.
- CityListScreen : The user can select a city from a list of available cities.
- ProfileScreen : The user can see their account information and log out.

## City list

The `city_list.json` file contains the list of available cities for the user to select, along with their coordinates.

The structure of the file is similar to the firebase document given below.

The choice was made to use a limited list of cities to avoid having to call another API to get the list of cities.

At first, the OpenWeatherMap provides a list of cities, but it is too large for the app to handle without lagging.

The list was made by reworking a list of cities with airports, from the Global Airport
Database (https://www.partow.net/miscellaneous/airportdatabase/).

From the 9300 original cities, the list was reduced by removing duplicates (cities with multiple airports).
Such a thing was done this way :

- If two cities have a similar name (one is a substring of the other), AND they are less than 100 km apart, the one with
  the shortest name is kept.
  This remove cities like "Paris" and "Paris-Orly", keeping only "Paris".
  And this prevents removing London, UK, and London, Canada, for example.

This choice allows the app to be more responsive while still being exhaustive in terms of city choice.

## Firebase

The backend of the app is hosted on Firebase.
Using Firebase Authentication, we can create an account and log in to the app.

The Firestore database is used to store the user's selected cities.

Here is the Firebase `users/{user-id}` document structure :

```json lines
{
  createdAt: "date of creation, not used",
  cityList: [
    {
      city: "city name",
      country: "country name",
      id: "city id on the city_list.json file",
      lat: "latitude",
      long: "longitude"
    },
    (...)
  ]
}
```

The `openweathermap/openweathermapApiKey` document also contains the apiKey field with the key for the OpenWeatherMap
API.
As the project is only an exercise, the same key is used for all users, considering the number of calls is small.

## OpenWeatherMap

The OpenWeatherMap API is used to get the weather data for the selected cities.
The API call used is the following :

```
api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metrics
```

The API key is stored in the Firebase database, and the units are set to metrics.

## Dynamic Theming

The app's theme changes based on the weather data.
The background images are chosen based on the OpenWeatherMap weather codes.
This means the following images are used :

- 01d, 01n : clear sky
- 02d, 02n : few clouds
- 03d, 03n : scattered clouds
- 04d, 04n : broken clouds
- 09d, 09n : shower rain
- 10d, 10n : rain
- 11d, 11n : thunderstorm
- 13d, 13n : snow
- 50d, 50n : mist

Thus, there is a total of 18 images used for the background.

There is also 1 image used in the rest of the app (the login screen, the city selection screen, and the profile screen).