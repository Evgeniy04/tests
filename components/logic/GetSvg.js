import { url_api } from "../../constants/api";
import parse from "html-react-parser";

export const GetSvg = async (mml) => {
  let response = await fetch(`${url_api}forms/mathjax/getSvg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      mml,
    }),
  });
  let { svg } = await response.json();
  return parse(svg);
};
