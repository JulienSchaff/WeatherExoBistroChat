import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProfileScreen from "../app/screens/ProfileScreen";
import { FIREBASE_AUTH } from "../index";

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

jest.mock("../index", () => ({
    FIREBASE_AUTH: {
        currentUser: { email: "testuser@example.com" },
        signOut: jest.fn(),
    },
}));

const mockedNavigation = { navigate: jest.fn() };

describe("ProfileScreen", () => {
    it("renders correctly", () => {
        const { getByTestId, getByText } = render(
            <ProfileScreen navigation={mockedNavigation} />
        );

        expect(getByTestId("profile-screen")).toBeTruthy();
        expect(getByTestId("user-email").props.children).toBe("testuser@example.com");
    });

    it("navigates to the Home screen on back button press", () => {
        const { getByTestId } = render(<ProfileScreen navigation={mockedNavigation} />);

        fireEvent.press(getByTestId("back-button"));
        expect(mockedNavigation.navigate).toHaveBeenCalledWith("HomeScreen", { cityList: [] });
    });

    it("calls signOut on Sign Out button press", () => {
        const { getByTestId } = render(<ProfileScreen navigation={mockedNavigation} />);

        fireEvent.press(getByTestId("sign-out-button"));
        expect(FIREBASE_AUTH.signOut).toHaveBeenCalled();
    });
});
