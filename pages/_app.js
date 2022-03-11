import { Provider } from "react-redux";
import { store } from "../app/store";
import { StyledEngineProvider } from "@mui/material";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <Component {...pageProps} />
      </StyledEngineProvider>
    </Provider>
  );
}

String.prototype.hexEncode = function () {
  let hex, i;

  let result = "";
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }

  return result;
};

String.prototype.hexDecode = function () {
  let j;
  let hexes = this.match(/&#x\w*/gi) || [];
  if (hexes.length) {
    let result = this;
    for (j = 0; j < hexes.length; j++) {
      result = result.replace(
        hexes[j] + ";",
        String.fromCharCode(parseInt(hexes[j].slice(3), 16))
      );
    }
    return result;
  } else {
    return this;
  }
};

export default MyApp;
