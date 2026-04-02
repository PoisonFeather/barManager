Nu se updateaza comenzile intre clienti la mese combinate
Nu se valideaza daca masa e deschisa daca a fost combinata cu una inainte (poti pune comenzi daca barmanul trage masa inainte sa ii dea accept)
🟢 Faza 1: Autentificare & Securitate (Prioritate Maximă)
Obiectiv: Nimeni nu intră în Dashboard fără bilet de voie.

[x] Test End-to-End Onboarding: Creare bar nou -> Verificare users (parolă hash-uită) și bars în DB.
[ ] Validare token cu atuh (daca este un token vechi apare forbiden (cum implementez asta fara sa fut restul))
[x] Finalizare Login UI: Adăugat trim().toLowerCase() pe username și gestionarea stărilor de loading/error.
[ ] Nu se updateaza toatul la masa parinte
[x] Backend isAuth Middleware:

[x] Extragere token din header-ul Authorization: Bearer <token>.

[x] Validare JWT și atașare req.user = decoded (care să conțină barId și userId).

[x] Protejarea Rutelor (Backend): Aplicarea middleware-ului pe toate rutele de mutare date (POST, PUT, PATCH, DELETE).

[ ] Izolare Date (Multitenancy): Modificarea query-urilor SQL în Repository pentru a include mereu WHERE bar_id = req.user.barId.

[ ] Environment Security: Mutarea JWT_SECRET și a url-urilor de DB din cod în fișierul .env.

[x] Drag and drop la mese (baza de date - dashboard - logica validare)
🏗️ Faza 2: Refactorizare Arhitecturală (Strict SRP)
Obiectiv: Cod curat, modular și ușor de testat.

[ ] Standardizare Error Handling:

[ ] Crearea unui helper unic în backend pentru răspunsurile de eroare (ex: fail(res, message, status)).

[ ] Eliminarea codului duplicat de rezolvare a statusurilor HTTP din controllere.

[ ] Finalizare Validări: Extinderea validation.js pentru a acoperi toate endpoint-urile mutabile (editare produs, toggle stoc, etc.).

[ ] Refactorizare Dashboard Service (Frontend): Mutarea logicii de fetch din componente în dashboardService.ts pentru a respecta layering-ul.

[ ] Documentare: Note scurte în README pentru Repository/Service cu exemple de utilizare.

🚀 Faza 3: Real-time & Logică de Sesiune
Obiectiv: Experiență fluidă pentru barmani și clienți.

[ ] Închidere Masă (Socket Logic):

[ ] Implementare notificare prin Socket.io când o masă se închide.

[ ] Logică de ștergere a token-ului de sesiune al clientului după un cooldown (ex: 15 minute).

[ ] Update Client-Side: Refresh automat al stării mesei în interfața clientului după ce barmanul procesează plata.

🎨 Faza 4: UX & Polish (Interfața Admin)
Obiectiv: O aplicație care se simte profesională.

[x] Auth Interceptor: Crearea unui wrapper peste fetch care injectează automat token-ul din localStorage în headere.

[x] Protected Routes (Next.js): Logică de redirect la /login dacă un utilizator neautorizat încearcă să acceseze /dashboard.

[ ] Sistem de Toast-uri: Notificări vizuale pentru acțiuni reușite ("Produs salvat!") sau eșecuri.

[ ] Logout Logic: Buton dedicat în Header care șterge token-ul și face redirect la login.

🧪 Faza 5: Stabilitate (Testing)
Obiectiv: Să dormi liniștit când faci deploy.

[ ] Teste de Integrare (Critical Flows):

[ ] Flow-ul de Onboarding.

[ ] Creare comandă -> Servire produs -> Închidere masă.

[ ] Cleanup DB: Ștergerea scripturilor de tip seed-user.js și eliminarea datelor de test fără UUID-uri valide.

[ ] Fallback la TOT

Faza 6 Analytics
[ ] vanzari - zi
[ ] timp asteptare
[ ] produse top

Faza 7 Upsell

- Cand adaugi gen un burger in cos, primesti mini notificare cu un upsell
  ✅ Completed (Done)
  [x] Refactorizare rute orders, menu, onboarding, dashboard și requests pe structura Controller -> Service -> Repository.

[x] Implementare validare payload pentru onboarding, comenzi și cereri.

[x] Tabelul users creat și legat prin Foreign Key de bars.

[x] Logica de hash-uire a parolelor cu bcrypt.
