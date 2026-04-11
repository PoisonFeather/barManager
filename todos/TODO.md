Nu se updateaza comenzile intre clienti la mese combinate

Reservations - intrii pe barmanager.ro/alba-iulia/ cauti framm's si dai rezervare de la 8 pentru 10 persoane, pui un mail, barul o confirma, primesti confirmarea pe mail/telefon -> link cu meniul ca sa il trimiti la grup sau asa !!

🟢 Faza 1: Autentificare & Securitate (Prioritate Maximă)
Obiectiv: Nimeni nu intră în Dashboard fără bilet de voie.

[ ] Nu se updateaza toatul la masa parinte

[ ] Izolare Date (Multitenancy): Modificarea query-urilor SQL în Repository pentru a include mereu WHERE bar_id = req.user.barId.

[ ] Environment Security: Mutarea JWT_SECRET și a url-urilor de DB din cod în fișierul .env.

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
[ ] timp asteptare

Faza 7 Upsell

- Cand adaugi gen un burger in cos, primesti mini notificare cu un upsell

[ ] Cand comanzi de mancare sa poti sa pui un request mic care sa apara la bucatari
[ ] cont separat cu views diferite pentru barman,chelner,bucatarie
