import axios from "axios";

export function walkInOn() {
  axios.get("http://192.168.1.199:8080/walkInOn");
}
