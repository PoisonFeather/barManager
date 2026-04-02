# Feature: Auto-Join Window (Fereastra de Timp)

## 📌 Scopul Funcționalității
Să permitem clienților noi care se așează la o masă să se poată alătura sesiunii curente **instant și fără pași extra** (zero friction), DAR să împiedicăm trollii sau persoanele rău-intenționate să comande de acasă folosind poze vechi cu codul QR.

## 🧠 Cum funcționează (Logica)
În loc să ne bazăm pe PIN-uri sau aprobări manuale care încetinesc experiența utilizatorului, ne bazăm pe **timp**:
1. O masă este **Ggoală/Închisă**. Clientul 1 scanează codul.
2. Sesiunea Mesei este deschisă și se înregistrează `session_started_at`.
3. În următoarele **15 minute** (Fereastra de Auto-Join), ORICINE scanează același cod QR de pe masă se așează și el la masă automat, intrând fix în aceeași sesiune comună, gata de comandat.
4. După ce trec cele 15 minute, masa intră în modul **LOCKED**.
5. Dacă o persoană de acasă scanează codul la întâmplare noaptea, nimerind pe modul Locked, serverul îi refuză accesul (returnând un mesaj "Masa este blocată").
6. Dacă vine un prieten întârziat după 30 de minute, va vedea și el mesajul de blocare, dar poate ruga un prieten de la masă să apese un buton de **"Deblocare Masă pt. 5 minute"** din interfața comună.

## 🛠️ Pașii de Implementare

### 1. Modificări Bază de Date (Backend)
- [ ] Adăugare coloană pe tabela `tables` sau pe modelul de comandă curentă: `session_started_at` (TIMESTAMP).
- [ ] Adăugare status auxiliar/coloană pe tabelă: `is_locked` (BOOLEAN, default `false`), deși poate fi derivat strict din difernța de timp. (De preferat să derivăm automat ca funcție din `session_started_at`, dar pentru extra control manual, o coloană flag ajută).

### 2. Logica din Serviciul de Meniu / Comenzi (Backend)
- [ ] În metoda `GET /menu/:slug?tableId=...` (endpoint-ul pe care îl accesează primul client / scannerul codului):
  - Găsim masa în BD.
  - Verificăm dacă are `session_started_at`.
  - Dacă e Ggoală (nicio sesiune) -> O lăsăm și inițiem pre-comandă.
  - Dacă e Activă -> Calculăm de cât timp e activă (`NOW() - session_started_at`).
  - Dacă timpul **< 15 minute** -> Returnăm HTTP 200, dăm token de sesiune, clientul intră!
  - Dacă timpul **> 15 minute** -> Returnăm o eroare / status specific (ex. `403 Forbidden` - "Session Locked").

### 3. Endpoint de Deblocare Manuală (Backend)
- [ ] Creare rută izolată `PATCH /tables/:tableId/unlock`.
- [ ] Va fi apelabilă DIn aplicația clientului care are deja un token valid la acea masă.
- [ ] Execută acțiunea de a updata `session_started_at = NOW()` (astfel prelungind fereastra din nou cu încă 15 minute, automat făcând masa "Unlocked").

### 4. Integrarea în Aplicația și Interfața Clientului (Frontend)
- [ ] În componenta pilon de la meniu, dacă server-ul întoarce `403 Session Locked`, afișăm ecranul: 
  * "🔒 Această masă a fost încuiată din motive de securitate. Te rugăm să-i ceri unui prieten care e deja la masă să apese butonul de Deblocare din meniul lui."*
- [ ] În Banner-ul Meniului pentru utilizatorii deja logați activ: adăugăm un buton discret 🔓 (Unlock Table).
  - La click, trage request la `/tables/.../unlock`.
  - Arată un toast de succes ("Masa a fost deblocată pentru 5/15 minute! Colegii pot scana acum codul.").

## 💡 Idei Utile Extra
- Din experiență, majoritatea oaspeților se așează și scanează în primele 5 minute. O fereastră de **10 sau 15 minute** va oferi zero-friction extrem de comod fară vreun efort.
- Prin folosirea WebSockets, când masa este deblocată, toți clienții (dacă cumva stăteau pe ecranul ăla de eroare) pot face refresh automat.
- Barmanul ar putea avea și el din Dashboard un buton rapid de "Unlock" pe cartonașul mesei, în caz că host-ul s-a rătăcit și prietenul vine direct la bar să ceară asistență.
