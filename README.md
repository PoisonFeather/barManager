# 🍺 BarManager SaaS – QR Ordering System

Platformă SaaS modernă pentru digitalizarea meniurilor și gestionarea comenzilor în baruri și restaurante, folosind QR codes și o experiență complet web, fără instalare de aplicații.

## 🚀 Descriere

BarManager este un sistem full-stack pentru localuri care permite:

* crearea rapidă a unui bar prin onboarding complet;
* generarea automată a meniurilor digitale;
* comandă directă de pe telefon prin QR code;
* dashboard live pentru barman;
* gestionarea comenzilor în timp real.

Backend-ul este construit cu Node.js și Express, iar partea de interfață folosește Next.js. Structura proiectului sugerează un MVP orientat spre QR ordering white-label pentru baruri și restaurante.            

## 🧠 Arhitectură

```text
Client (Next.js)
    ↓
REST API (Node.js / Express)
    ↓
PostgreSQL (Docker)
```

API-ul central gestionează baruri, categorii, produse, mese și comenzi, iar frontend-ul include cel puțin o pagină de onboarding, o pagină pentru meniul clientului și un dashboard pentru barman.                

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL prin `pg`
* `dotenv`
* `cors`

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

Dependințele backend-ului și configurația de rulare sunt definite în `package.json`.    

## ⚙️ Setup Local

### 1. Clone repository

```bash
git clone https://github.com/PoisonFeather/barManager.git
cd barManager
```

Repository-ul este declarat în configurarea proiectului.    

### 2. Instalare dependențe backend

```bash
npm install
```

### 3. Pornire backend

```bash
npm run dev
```

Scriptul `dev` pornește `nodemon index.js`. Backend-ul este configurat implicit pentru portul 3001.        

### 4. Pornire frontend

```bash
cd admin-panel
npm install
npm run dev
```

În README-ul existent este menționat frontend-ul pe portul 3000 și backend-ul pe portul 3001.    

## 🔐 Environment Variables

Creează un fișier `.env` pentru backend cu o variabilă de forma:

```env
DATABASE_URL=postgres://user:password@localhost:5432/barmanager
```

Conexiunea către PostgreSQL este realizată prin `process.env.DATABASE_URL`.    

## 📦 API Overview

## 1. Onboarding complet

```http
POST /onboarding/full-setup
```

Acest endpoint creează într-o singură tranzacție:

* barul;
* categoriile;
* produsele;
* mesele localului.

Fluxul este tranzacțional, folosind `BEGIN`, `COMMIT` și `ROLLBACK` pentru consistența datelor.    

### Exemplu payload

```json
{
  "bar_name": "Sunset Pub",
  "slug": "sunset-pub",
  "primary_color": "#ff5500",
  "bar_number_tables": 12,
  "menu": [
    {
      "category": "Cocktailuri",
      "products": [
        {
          "name": "Mojito",
          "price": 28,
          "description": "Rom, lime, menta, sifon"
        }
      ]
    }
  ]
}
```

Onboarding-ul este folosit și de interfața frontend dedicată creării unui bar nou.    

## 2. Vizualizare meniu complet

```http
GET /menu-complete/:slug
```

Returnează:

* informațiile barului;
* mesele asociate;
* categoriile;
* produsele din fiecare categorie.

Acest endpoint folosește JSON aggregation în SQL pentru a returna tot meniul într-un singur răspuns optimizat.    

## 3. Vizualizare meniu simplificat

```http
GET /menu/:slug
```

Endpoint de test care verifică dacă barul există și întoarce categoriile asociate.    

## 4. Adăugare categorie

```http
POST /categories
```

Permite inserarea unei categorii noi cu `bar_id`, `name` și `display_order`.    

## 5. Adăugare produs

```http
POST /products
```

Permite inserarea unui produs nou cu `category_id`, `name`, `price`, `description` și `image_url`.    

## 6. Creare comandă

```http
POST /orders
```

Procesează o comandă nouă pe baza:

* `bar_id`
* `table_id`
* `items`
* `total_amount`

Comanda este inserată tranzacțional în `orders` și `order_items`. Coșul gol este validat explicit înainte de procesare.    

## 7. Vizualizare comenzi active

```http
GET /orders/:barId
```

Endpoint pentru vizualizarea comenzilor active ale unui bar. Implementarea apare în backend-ul principal.    

## 🧾 Frontend Features

## Client QR Menu

Pagina clientului:

* citește slug-ul barului din URL;
* identifică masa din query params;
* încarcă meniul complet;
* persistă coșul în `localStorage`;
* trimite comenzile către backend;
* încarcă istoricul mesei.

Fluxul de client este implementat într-o pagină Next.js cu fetch direct către backend-ul local.    

## Onboarding UI

Pagina de onboarding permite:

* introducerea numelui barului;
* setarea slug-ului;
* alegerea culorii principale;
* definirea numărului de mese;
* adăugarea dinamică de categorii și produse;
* trimiterea întregului setup către endpoint-ul de onboarding.

Această interfață este orientată spre configurare rapidă pentru un bar nou.    

## Bartender Dashboard

Dashboard-ul pentru barman oferă:

* vizualizarea meselor active;
* gruparea produselor pending pe mese;
* polling la 10 secunde;
* marcarea produselor ca servite;
* închiderea unei mese;
* activare sau dezactivare stoc pentru produse.

Interfața are două tab-uri principale: `orders` și `stock`.    

## 📂 Structură proiect

Structura dedusă din fișierele disponibile și README-ul existent:

```text
/backend
  index.js

/admin-panel
  app/
    onboarding/
    [slug]/
    dashboard/

docker/
package.json
README.md
```

README-ul deja existent menționează și directoare dedicate pentru docker și scripturi de automatizare.    

## 🔥 Puncte forte

* onboarding complet într-un singur request;
* logică tranzacțională pentru date critice;
* agregare JSON direct în PostgreSQL;
* experiență client simplă, bazată pe QR și web;
* dashboard operațional pentru fluxul din bar.

Aceste direcții apar explicit atât în comentariile din backend, cât și în README-ul actual.        
 

## 🗺 Roadmap recomandat

* autentificare pentru administratori și baruri;
* validare request-uri;
* rate limiting și securizare API;
* WebSocket sau SSE pentru update-uri live;
* generare QR per masă;
* analytics pentru comenzi și produse;
* integrare plăți.

Primele obiective din roadmap-ul existent includ deja multi-tenant DB, onboarding bulk import și client view premium.    

## 👨‍💻 Autor

Andrei Biro, 2026.    

## 💡 Concept

Ideea centrală a proiectului este simplificarea fluxului de comandă în localuri:

**Scan → View Menu → Add to Cart → Send Order → Serve**

Acest flux este susținut de backend-ul Express, de pagina de client și de dashboard-ul pentru barman.            
