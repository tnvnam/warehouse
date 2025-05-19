/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import AddProductCategory from './admin/AddProductCategory';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
    flex: 1,
  };
  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: isDarkMode ? '#000' : '#fff',
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
            flex: 1,
            justifyContent: 'center',
          }}>
          <AddProductCategory />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Bạn có thể thêm style riêng nếu cần
});

export default App;
