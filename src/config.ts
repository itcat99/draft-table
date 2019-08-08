import { getRatio, getFontFamily } from "helpers";
import { Config_I, TextAlign_Enum, TextBaseline_Enum } from "types/common.type";

const CONFIG: Config_I = {
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
  lineHeight: "16px", // 字体的行高
  lineWidth: 1, // 线的宽度
  textAlign: TextAlign_Enum.LEFT,
  textBaseline: TextBaseline_Enum.TOP,
};

export default CONFIG;
