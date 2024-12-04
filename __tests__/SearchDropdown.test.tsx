import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import SearchDropdown from "../app/components/SearchDropdown.tsx";
import renderer from 'react-test-renderer';

describe('SearchDropdown', () => {
    const mockData = [
        { key: 1, value: 'Paris' },
        { key: 2, value: 'New York' },
    ];
    const mockOnSelectItem = jest.fn();

    it('renders correctly', () => {
        const { getByPlaceholderText, queryByTestId } = render(
            <SearchDropdown data={mockData} onSelectItem={mockOnSelectItem} />
        );

        expect(getByPlaceholderText('Search...')).toBeTruthy();
        expect(queryByTestId('filteredDataList')).toBeNull();
    });

    it('filters the data based on the input', () => {
        const { getByPlaceholderText, getByText, queryByText } = render(
            <SearchDropdown data={mockData} onSelectItem={mockOnSelectItem} />
        );

        const searchInput = getByPlaceholderText('Search...');
        fireEvent.changeText(searchInput, 'Par');

        expect(getByText('Paris')).toBeTruthy();
        expect(queryByText('New York')).toBeNull();
    });

    it('calls onSelectItem with the selected item and resets input', () => {
        const { getByPlaceholderText, getByText } = render(
            <SearchDropdown data={mockData} onSelectItem={mockOnSelectItem} />
        );

        const searchInput = getByPlaceholderText('Search...');
        fireEvent.changeText(searchInput, 'Par');

        const listItem = getByText('Paris');
        fireEvent.press(listItem);

        expect(mockOnSelectItem).toHaveBeenCalledWith({ key: 1, value: 'Paris' });
        expect(searchInput.props.value).toBe('');
    });

    it('does not display results for non-matching input', () => {
        const { getByPlaceholderText, queryByTestId } = render(
            <SearchDropdown data={mockData} onSelectItem={mockOnSelectItem} />
        );

        const searchInput = getByPlaceholderText('Search...');
        fireEvent.changeText(searchInput, 'xyz');

        expect(queryByTestId('filteredDataList')).toBeNull();
    });

    it('dismisses the keyboard after selection', () => {
        jest.spyOn(Keyboard, 'dismiss');

        const { getByPlaceholderText, getByText } = render(
            <SearchDropdown data={mockData} onSelectItem={mockOnSelectItem} />
        );

        const searchInput = getByPlaceholderText('Search...');
        fireEvent.changeText(searchInput, 'Par');

        const listItem = getByText('Paris');
        fireEvent.press(listItem);

        expect(Keyboard.dismiss).toHaveBeenCalled();
    });
});
