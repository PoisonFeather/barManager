import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 400, // 1000 de utilizatori simultani (ca și cum 100 de mese ar comanda deodată)
  duration: "10s",
};

export default function () {
  // Testăm ruta de meniu care face cerere la backend
  http.get(
    "http://204.168.143.186/menu/somm-wine-cheese?t=451b1def-3b14-42a9-8dfe-ba2ab591d158"
  ); // sau ce rută de API ai tu
  sleep(1);
}
