/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import {LayoutChangeEvent, View} from 'react-native';
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {SnapPointItem} from './snapPointsGenerator';

function clamp(value: number, min: number, max: number) {
	'worklet';
	return Math.min(Math.max(value, min), max);
}

type Props = {
	snapPoints: undefined | SnapPointItem[];
	setChildDimensions: any;
	childDimensions: any;
	children: React.ReactNode;
	parentDimensions: {
		width: number;
		height: number;
	};
};

export function SnapItem(props: Props) {
	const {
		children,
		parentDimensions,
		snapPoints,
		childDimensions,
		setChildDimensions,
	} = props;
	const transX = useSharedValue(0);
	const transY = useSharedValue(0);

	function onLayoutChild(evt: LayoutChangeEvent) {
		setChildDimensions({
			width: evt.nativeEvent.layout.width,
			height: evt.nativeEvent.layout.height,
		});
	}

	function moveIt(velocityX: number, velocityY: number) {
		'worklet';

		const width = parentDimensions.width - (childDimensions.width ?? 0); // minus width
		const height = parentDimensions.height - (childDimensions.height ?? 0); // minus height
		const toss = 0.2;

		const targetX = clamp(transX.value + toss * velocityX, 0, width);
		const targetY = clamp(transY.value + toss * velocityY, 0, height);

		let snapX = targetX;
		let snapY = targetY;

		if (snapPoints?.length) {
			let currentSmallestIndex = 0;
			let currentSmallestDistance = parentDimensions.width;

			for (let i = 0; i < snapPoints.length; i++) {
				/// weird how it keeps saying it might be undefined when the loop should have provided that info?
				const snapPoint = snapPoints[i]!;

				const dist = Math.sqrt(
					Math.pow(targetX - snapPoint.x, 2) +
						Math.pow(targetY - snapPoint.y, 2),
				);

				if (dist < currentSmallestDistance) {
					currentSmallestDistance = dist;
					currentSmallestIndex = i;
				}
			}

			/// weird how it keeps saying it might be undefined when the loop should have provided that info?
			const selectedSnapPoint = snapPoints[currentSmallestIndex]!;
			snapX = selectedSnapPoint.x;
			snapY = selectedSnapPoint.y;

			/// correction
		} else {
			const top = targetY;
			const bottom = height - targetY;
			const left = targetX;
			const right = width - targetX;
			const minDistance = Math.min(top, bottom, left, right);
			switch (minDistance) {
				case top:
					snapY = 0;
					break;
				case bottom:
					snapY = height;
					break;
				case left:
					snapX = 0;
					break;
				case right:
					snapX = width;
					break;
			}
		}

		transX.value = withSpring(snapX, {
			velocity: velocityX,
		});
		transY.value = withSpring(snapY, {
			velocity: velocityY,
		});
	}

	type AnimatedGHContext = {
		startX: number;
		startY: number;
	};
	const gestureHandler = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		AnimatedGHContext
	>({
		onStart: (_, ctx) => {
			ctx.startX = transX.value;
			ctx.startY = transY.value;
		},
		onActive: (event, ctx) => {
			transX.value = ctx.startX + event.translationX;
			transY.value = ctx.startY + event.translationY;
		},
		onEnd: event => {
			moveIt(event.velocityX, event.velocityY);
		},
	});

	useEffect(() => {
		moveIt(0, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [snapPoints, parentDimensions, childDimensions]);

	const style = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: transX.value,
				},
				{
					translateY: transY.value,
				},
			],
		};
	});

	return (
		<PanGestureHandler onGestureEvent={gestureHandler}>
			<Animated.View style={[{position: 'absolute'}, style]}>
				<View onLayout={onLayoutChild}>{children}</View>
			</Animated.View>
		</PanGestureHandler>
	);
}
