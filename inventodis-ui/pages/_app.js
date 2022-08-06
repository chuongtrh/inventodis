import "../styles/globals.css";
import "antd/dist/antd.css";
import TheLayout from "../components/TheLayout";

function MyApp({ Component, pageProps }) {
  return (
    <TheLayout>
      <Component {...pageProps} />
    </TheLayout>
  );
}

export default MyApp;
