import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 1000, // 1000 de utilizatori simultani (ca și cum 100 de mese ar comanda deodată)
  duration: "30s",
};

export default function () {
  // Testăm ruta de meniu care face cerere la backend
  http.get("http://localhost:3000/menu/somm-wine-cheese/"); // sau ce rută de API ai tu
  sleep(1);
}
