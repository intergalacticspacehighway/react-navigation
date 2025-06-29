import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { PathConfigMap } from '@react-navigation/native';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';
import { useHandler } from 'react-native-reanimated';
import { useEvent } from 'react-native-reanimated';
import { Dimensions, Animated } from 'react-native';

function usePageScrollHandler(handlers: any, dependencies: any) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);
  const subscribeForEvents = ['onPageScroll'];

  return useEvent(
    (event) => {
      'worklet';
      const { onPageScroll } = handlers;
      if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
        console.log('onPageScroll', event);
        onPageScroll(event, context);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  );
}

export type MaterialTopTabParams = {
  Albums: undefined;
  Contacts: undefined;
  Chat: undefined;
};

const linking: PathConfigMap<MaterialTopTabParams> = {
  Albums: 'albums',
  Contacts: 'contacts',
  Chat: 'chat',
};

const MaterialTopTabs = createMaterialTopTabNavigator<MaterialTopTabParams>();

const ChatScreen = () => <Chat bottom />;

const offset = new Animated.Value(0);

const CustomPager = ({ children }: { children: React.ReactNode }) => {
  return (
    <Animated.ScrollView
      horizontal
      pagingEnabled
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: offset } } }],
        { useNativeDriver: true }
      )}
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      }}
    >
      {children}
    </Animated.ScrollView>
  );
};
export function MaterialTopTabsScreen() {
  return (
    <MaterialTopTabs.Navigator
      PagerView={CustomPager as any}
      interpolatedPosition={offset.interpolate({
        inputRange: [
          0,
          Dimensions.get('window').width,
          Dimensions.get('window').width * 2,
          Dimensions.get('window').width * 3,
        ],
        outputRange: [0, 1, 2, 3],
      })}
    >
      <MaterialTopTabs.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
      <MaterialTopTabs.Screen
        name="Contacts"
        component={Contacts}
        options={{ title: 'Contacts' }}
      />
      <MaterialTopTabs.Screen
        name="Albums"
        component={Albums}
        options={{ title: 'Albums' }}
      />
    </MaterialTopTabs.Navigator>
  );
}

MaterialTopTabsScreen.title = 'Material Top Tabs';
MaterialTopTabsScreen.linking = linking;
MaterialTopTabsScreen.options = {
  headerShown: true,
  cardStyle: { flex: 1 },
};
