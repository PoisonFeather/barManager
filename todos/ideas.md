# 🚀 Idei & Funcționalități de Viitor pentru Bar Manager

Acest document conține o listă de "idei de aur" menite să aducă sistemul *Bar Manager* la un nivel de platformă completă tip enterprise, comparabilă cu sistemele scumpe de POS.

---

## 1. 🛡️ Conturi de Angajați & Ture (Staff Roles)
În loc să existe un singur cont de "Admin/Patron" pentru tot barul:
- **Rol de Manager/Patron**: Acces la `Analytics` și `Setări bar`.
- **Rol de Ospătar/Barman**: Acces doar la `Workspace` (preia comenzi, mută mese) și conectare prin PIN la început de tură.
- **Raport de Tură (Z-Report)**: Când barmanul își termină tura, se generează automat o notă cu banii de predat patronului.

## 2. 📱 Kitchen Display System (KDS) & Bar Display
Dacă produsele sunt amestecate (băuturi și mâncare/pizza):
- O pagină (View) separată pentru Bucătărie, care să primească automat comanda când masa de afară apasă pe "Trimite".
- Bucătarul poate apăsa "Gata Mâncarea" pe ecran, trimițând notificare pe Dashboard-ul principal (către ospătar) ca să vină să o ia.

## 3. 💳 Plăți Digitale (Tab & Pay at Table)
Reducerea drastică a nevoii de a chema ospătarul pentru notă:
- Integrare **Stripe** sau **Apple/Google Pay**.
- Clientul își verifică "Coșul / Istoricul", dă click pe "Plătește nota acum" și fondurile intră direct în contul Barului.
- Masa se închide **automat** fără intervenția barmanului.
- *Tip Screen*: O pagină drăguță la final unde clienții pot lăsa un ciubuc digital (5%, 10%, 15%).

## 4. 📦 Gestiune Avansată de Stocuri (Ingrediente)
În acest moment facem toggle "În Stoc" / "Epuizat".
- **Inventar Cantitativ / Multiplicator**: Setezi că mai ai 15 x sticle de "Heineken". La fiecare comandă, sistemul scade automat numărul.
- Când ajunge la 2 beri, trimite un e-mail / alertă vizuală "Stoc critic pe Heineken - trebuie să comandați de la furnizor!".

## 5. 🎨 Profilul și Brandul Barului
Oferim mai multe opțiuni de customizare pentru patron:
- Upload de `Logo.png` în setări ca să apară pe telefonul clienților.
- Opțiunea de "Dark Mode Only" sau fundal de meniu gradient personalizat.
- Posibilitatea de a adăuga o poză reprezentativă la fiecare categorie de produs (ex: Poze cu burgeri pentru Burgeri, un pahar cu gheață la Cocktailuri).

## 6. 🎉 Sistem de Fidelizare (Loyalty Points)
Pentru a încuraja întoarcerea clienților recurenți:
- O modalitate prin care un client frecvent se poate loga pe QR doar cu numărul de telefon.
- La fiecare comandă scanează și acumulează "Puncte" (ex: 5% din valoarea notei devine credit).
- La bar pot alege (din interfața telefonului) "Plătesc un Guiness cu cele 20 de Puncte adunate".

## 7. 🇬🇧 Meniu Multi-Limbi Automate
Pentru barurile din centru (zone turistice):
- Un buton mic în aplicația clienților (🇷🇴 RO / 🇬🇧 EN).
- Barmanul setează doar descrierea în Română, iar sistemul poate trage dintr-un API de traducere sau pre-tradus din baza de date pentru turiști.

## 8. 🚨 Prevenția "Uitatului" sau Afk (Temporizator de Mese)
- Pe cartonașele de masă din Admin poți vedea discret un cronometru de când nu a mai dat masa comenzi. (ex: *"Masa 4 e goală de 50 de minute, dar neînchisă"*).
- Ajută personalul să știe imediat dacă o masă stă de prea mult timp fără să facă consumație sau pur și simplu a plecat uitând să zică.

---

### Ce urmează?
Acestea sunt "Next-Level". Pentru moment, singurul *"Must Have"* care ar trebui atacat urgent în zilele următoare (sau chiar azi) din logica curentă este finalizarea planului tău excelent cu **"Fereastra de Auto-Join la Mese"** *(Auto-Join Window de 15 minute)*, pe care l-am notat deja tehnic în `todos/feature-auto-join.md`. 
