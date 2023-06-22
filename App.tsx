/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
	Dimensions,
	StatusBar,
	StyleSheet,
	useColorScheme,
	View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SnapPointsImplicit} from './src/snapPointsGenerator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SnapArea} from './src/SnapArea';

const snapPoints = [
	[1, 1, 1],
	[1, 1, 1],
	[1, 1, 1],
] as SnapPointsImplicit;

const screenWidth = Dimensions.get('window').width;
const blockWidth = (screenWidth - 50) / 3;

function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	return (
		<>
			<StatusBar
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<GestureHandlerRootView style={{flex: 1}}>
				<View
					style={[
						{
							height: blockWidth * 3,
							backgroundColor: 'red',
							borderWidth: 1,
							borderColor: 'black',
							marginVertical: 150,
							marginHorizontal: 25,
						},
					]}>
					<SnapArea snapPoints={snapPoints} wrapType={'edge'}>
						<View style={[styles.head, {backgroundColor: 'black'}]} />
						<View style={[styles.head, {backgroundColor: 'black'}]} />
						<View style={[styles.head, {backgroundColor: 'black'}]} />
					</SnapArea>
				</View>
			</GestureHandlerRootView>
		</>
	);
}

const styles = StyleSheet.create({
	head: {
		width: blockWidth,
		height: blockWidth,
	},
	headContainer: {
		position: 'absolute',
	},
});

export default App;
