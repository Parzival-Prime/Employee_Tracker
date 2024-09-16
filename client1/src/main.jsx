import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from './app/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import Loader from "./components/Loader";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>
)
