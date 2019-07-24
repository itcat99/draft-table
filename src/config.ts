import { getRatio, getFontFamily } from "./helpers";

enum TextAlignEnum {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
  START = "start",
  END = "end",
}

enum TextBaselineEnum {
  TOP = "top",
  HANGING = "hanging",
  MIDDLE = "middle",
  ALPHABETIC = "alphabetic",
  IDEOGRAPHIC = "ideographic",
  BOTTOM = "bottom",
}

interface Config {
  target: HTMLElement;
  width: Number;
  height: Number;
  ratio: Number;
  strokeStyle: String;
  fillStyle: String;
  fontStyle: String;
  fontVariant: String;
  fontStretch: String;
  fontWeight: Number;
  fontSize: Number;
  fontFamily: String;
  lineHeight: Number; // 字体的行高
  lineWidth: Number; // 线的宽度
  textAlign: TextAlignEnum;
  textBaseline: TextBaselineEnum;
}

const CONFIG: Config = {
  target: document.body, // 如果是一个canvas，则使用这个canvas；如果不是，则渲染到这个元素内；
  width: 800,
  height: 600,
  ratio: getRatio(), // 设备屏幕像素比
  strokeStyle: "#000000",
  fillStyle: "#000000",
  fontStyle: "normal",
  fontVariant: "normal",
  fontStretch: "normal",
  fontWeight: 400,
  fontSize: 16,
  fontFamily: getFontFamily(),
  lineHeight: 16, // 字体的行高
  lineWidth: 1, // 线的宽度
  textAlign: TextAlignEnum.LEFT,
  textBaseline: TextBaselineEnum.TOP,
};

export default CONFIG;
