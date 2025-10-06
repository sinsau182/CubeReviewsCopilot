import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Provider } from 'react-redux';
import { store } from '../store';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster />
    </Provider>
  );
}
