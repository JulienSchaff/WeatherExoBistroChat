import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../app/screens/LoginScreen";
import { FIREBASE_AUTH } from "../index";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import {getDoc} from "@react-native-firebase/firestore";

jest.mock("react-native-vector-icons/FontAwesome6", () => {
    return ({ name } : any) => `MockedIcon-${name}`;
});

jest.mock("@react-native-firebase/auth", () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("@react-native-firebase/firestore", () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
}));

jest.mock("../index", () => ({
    FIREBASE_AUTH: {},
    FIREBASE_FIRESTORE: {},
}));

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the login screen correctly", () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        expect(getByPlaceholderText("Email")).toBeTruthy();
        expect(getByPlaceholderText("Password")).toBeTruthy();
        expect(getByText("Sign In")).toBeTruthy();
        expect(getByText("Sign Up")).toBeTruthy();
    });

    it("updates email and password inputs", () => {
        const { getByPlaceholderText } = render(<LoginScreen />);

        const emailInput = getByPlaceholderText("Email");
        const passwordInput = getByPlaceholderText("Password");

        fireEvent.changeText(emailInput, "test@example.com");
        fireEvent.changeText(passwordInput, "password123");

        expect(emailInput.props.value).toBe("test@example.com");
        expect(passwordInput.props.value).toBe("password123");
    });

    it("calls signIn on pressing Sign In button", async () => {
        const mockedSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;
        mockedSignInWithEmailAndPassword.mockResolvedValueOnce({
            user: { uid: "12345" },
        });
        const mockedGetDoc = getDoc as jest.Mock;
        mockedGetDoc.mockResolvedValueOnce({ exists: () => true });

        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
        fireEvent.changeText(getByPlaceholderText("Password"), "password123");
        fireEvent.press(getByText("Sign In"));

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
                FIREBASE_AUTH,
                "test@example.com",
                "password123"
            );
            expect(getDoc).toHaveBeenCalled();
        });
    });

    it("creates a new user doc on Sign Up if user does not exist", async () => {
        const mockedCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.Mock;
        mockedCreateUserWithEmailAndPassword.mockResolvedValueOnce({
            user: { uid: "67890" },
        });
        const mockedGetDoc = getDoc as jest.Mock;
        mockedGetDoc.mockResolvedValueOnce({ exists: () => false });

        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText("Email"), "newuser@example.com");
        fireEvent.changeText(getByPlaceholderText("Password"), "password456");
        fireEvent.press(getByText("Sign Up"));

        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
                FIREBASE_AUTH,
                "newuser@example.com",
                "password456"
            );
            expect(getDoc).toHaveBeenCalled();
        });
    });

    it("shows ActivityIndicator when loading", async () => {
        const mockedSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;
        mockedSignInWithEmailAndPassword.mockImplementationOnce(() => new Promise(() => {}));

        const { getByText, getByTestId } = render(<LoginScreen />);

        fireEvent.press(getByText("Sign In"));

        await waitFor(() => {
            expect(getByTestId("activity-indicator")).toBeTruthy();
        });
    });
});
