import React, { useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
} from 'react-native';

type DataType = {
    key: any;
    value: string;
}

const SearchDropdown = (props: { data: DataType[], onSelectItem: (item: DataType) => void }) => {
    const [query, setQuery] = useState<string>('');
    const [filteredData, setFilteredData] = useState<DataType[]>([]);

    const handleSearch = (text: string) => {
        setQuery(text);

        if (text.length >= 2) {
            const filtered = props.data.filter((item) =>
                item.value.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    };

    const handleSelectItem = (item: DataType) => {
        setQuery("");
        setFilteredData([]);
        Keyboard.dismiss();

        props.onSelectItem(item);
    };


    return (
        <View
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <TextInput
                    testID="citySearchInput"
                    style={styles.input}
                    placeholder="Search..."
                    value={query}
                    onChangeText={handleSearch}
                />

                {query.length >= 2 && filteredData.length > 0 && (
                    <FlatList
                        testID="filteredDataList"
                        data={filteredData}
                        keyboardShouldPersistTaps={'always'}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                testID={`selectItem-${item.value}`}
                                onPress={() => handleSelectItem(item)}
                                style={styles.item}
                            >
                                <Text style={styles.selectedText}>{item.value}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        flex: 1,
    },
    input: {
        height: 45,
        fontSize: 16,
        borderColor: 'white',
        color: 'white',
        borderWidth: 2,
        paddingLeft: 16,
        borderRadius: 8,

    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'gray',
    },
    selectedText: {
        textAlign: 'center',
        alignItems: 'center',
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SearchDropdown;
