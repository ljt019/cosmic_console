import axios from "axios";

export function walkInOff() {
  axios.get("http://192.168.1.199:8080/walkInOff");
}
