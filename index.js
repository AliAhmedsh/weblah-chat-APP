/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler'
import { persistedStore, store } from './src/redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react'

const WrappedApp = () => (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistedStore}
      >
        <App />
      </PersistGate>
    </Provider>
  )
AppRegistry.registerComponent(appName, () => WrappedApp);
