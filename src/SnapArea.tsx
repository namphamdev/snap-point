/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Dimensions, LayoutChangeEvent, View} from 'react-native';
import {snapPointsGenerator, SnapPointsImplicit} from './snapPointsGenerator';
import type {SnapPointItem, WrapTypes} from './snapPointsGenerator';
import {SnapItem} from './SnapItem';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

type Props = {
	snapPoints?: SnapPointsImplicit;
	snapPointsExplicit?: SnapPointItem[];
	wrapType?: WrapTypes;
	children: React.ReactNode[];
};

export function SnapArea(props: Props) {
	const {children} = props;

	const [parentDimensions, setParentDimensions] = useState({
		width: windowWidth,
		height: windowHeight,
	});

	function onLayoutParent(evt: LayoutChangeEvent) {
		setParentDimensions({
			width: evt.nativeEvent.layout.width,
			height: evt.nativeEvent.layout.height,
		});
	}

	const [childDimensions, setChildDimensions] = useState({
		width: 0,
		height: 0,
	});

	const [snapPoints, setSnapPoints] = useState<undefined | SnapPointItem[]>(
		undefined,
	);

	useEffect(() => {
		if (props.snapPointsExplicit) {
			setSnapPoints(props.snapPointsExplicit);
		} else if (props.snapPoints?.length) {
			setSnapPoints(
				snapPointsGenerator(
					parentDimensions.width - (childDimensions.width ?? 0),
					parentDimensions.height - (childDimensions.height ?? 0),
					props.snapPoints,
					props.wrapType,
				),
			);
		} else {
			if (snapPoints) {
				setSnapPoints(undefined);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		parentDimensions,
		childDimensions,
		props.snapPoints,
		props.snapPointsExplicit,
		props.wrapType,
	]);

	return (
		<View style={{width: '100%', height: '100%'}} onLayout={onLayoutParent}>
			{children.map((item, index) => (
				<SnapItem
					key={index}
					childDimensions={childDimensions}
					setChildDimensions={setChildDimensions}
					snapPoints={snapPoints}
					parentDimensions={parentDimensions}>
					{item}
				</SnapItem>
			))}
		</View>
	);
}
