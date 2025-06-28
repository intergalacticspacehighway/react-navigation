import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { PathConfigMap } from '@react-navigation/native';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';
import { useHandler, useSharedValue } from 'react-native-reanimated';
import { useEvent } from 'react-native-reanimated';
import ViewPager from 'react-native-pager-view';
import Reanimated from 'react-native-reanimated';
const ReanimatedPagerView = Reanimated.createAnimatedComponent(ViewPager);

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

export function MaterialTopTabsScreen() {
  const offset = useSharedValue(0);

  const pageScrollHandler = usePageScrollHandler(
    {
      onPageScroll: (e: any) => {
        'worklet';
        offset.value = e.offset;
        console.log(e.offset, e.position);
      },
    },
    [offset]
  );

  return (
    <MaterialTopTabs.Navigator
      onPageScroll={pageScrollHandler}
      PagerView={ReanimatedPagerView as any}
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
