module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|react-native-reanimated|@react-native|react-native-vector-icons|@react-native-firebase|react-native-localize)/)"
  ],
  setupFiles: ["<rootDir>/jest.setup.js"],
  silent: true,
};