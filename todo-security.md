# Security Vulnerabilities & Risk Assessment

Below is a breakdown of the security vulnerabilities and risks found in the codebase. They are grouped by severity so you can address the most pressing issues first.

## 🔴 Critical Risk

- [ ] **Missing Authentication Middleware (Broken Access Control)**
  - **Issue**: Although `auth.service.js` generates a valid JWT token on login, the application never actually validates this token on incoming requests. All endpoints across `dashboard.routes.js`, `orders.routes.js`, `menu.routes.js`, and `requests.routes.js` are unprotected.
  - **Impact**: Anyone with basic knowledge of the API can call administrative endpoints directly to create products, answer requests, merge tables, close tables, or edit items without logging in.
  - **Fix**: Create a JWT verification middleware and apply it globally in `app.js` (for private routes) or per-route for `/dashboard`, `/orders`, etc.

- [ ] **Insecure Direct Object Reference (IDOR) / Missing Ownership Checks**
  - **Issue**: There is a middleware `checkProductOwnership` within `src/middleware/authorization.js`, but it is **not used** on any of the product endpoints in `dashboard.routes.js`. 
  - **Impact**: Even if authentication is added later, a user who is logged into "Bar A" could modify, delete, or toggle availability for products belonging to "Bar B" simply by calling an endpoint with the target product's ID.
  - **Fix**: Apply the `checkProductOwnership` middleware to all routes that mutate or fetch resources belonging exclusively to a bar owner (`PATCH /products/:productId/toggle`, `PUT /products/:productId`, `DELETE /products/:productId`). Ensure similar checks exist for tables and orders.

- [ ] **Hardcoded / Default Secrets in Production**
  - **Issue**: In `auth.service.js`, the app falls back to `const JWT_SECRET = process.env.JWT_SECRET || "secret_de_test_pentru_dezvoltare_123";`.
  - **Impact**: If the `.env` file happens to be missing or misconfigured in production, the application will silently fall back to a hardcoded string. An attacker could forge valid JWT tokens and impersonate any user.
  - **Fix**: Remove the fallback. If `process.env.JWT_SECRET` is missing, the application should throw a fatal error on boot.

- [ ] **Sensitive Data Leakage in Logs**
  - **Issue**: Inside `auth.service.js` (line 37), the code logs `Token generat: ${token}. JWT_SECRET folosit: ${JWT_SECRET}`.
  - **Impact**: The most critical configuration string and user session tokens are printed in clear text to standard output. If server logs are consumed by third-party services (e.g. Datadog, CloudWatch), this is an extreme security breach.
  - **Fix**: Remove the console.log line immediately.

## 🟠 High Risk

- [ ] **Permissive CORS Configuration in REST API**
  - **Issue**: In `app.js`, CORS is configured with `origin: "*"`.
  - **Impact**: While Socket.IO in `index.js` restricts origins, the core API allows any external domain to make requests across origins. Combined with the lack of authentication, a malicious website could force an administrator's browser to execute actions in the bar dashboard.
  - **Fix**: Restrict the HTTP CORS origins in `app.js` to match the exact frontend domains (e.g., `["http://localhost:3000"]`) just like you did in `index.js` for WebSockets.

- [ ] **Weak Input Formats and Typosquatting (Validation Bypass)**
  - **Issue**: `validation.js` relies primarily on `isPositiveIntegerLike` and generic `isNonEmptyString`. The `isValidEntityId` function, which determines if an ID is valid, returns true for *any* non-empty string.
  - **Impact**: Attackers can send malformed strings or inject excessive payloads into fields expected to be strictly UUIDs or integer IDs.
  - **Fix**: If IDs are purely integers, enforce integer strictness (`typeof value === 'number'`). If IDs are UUIDs, evaluate using a strict RegExp validator for UUIDv4 instead of checking for a non-empty string.

## 🟡 Medium Risk

- [ ] **Lack of Rate Limiting against Brute-Force Attacks**
  - **Issue**: Endpoints like `POST /auth/login` and `/onboarding` are not protected by rate-limiters.
  - **Impact**: An attacker can repeatedly attempt to log in with guessed passwords or stuff compromised credentials.
  - **Fix**: Include a library such as `express-rate-limit` and apply strict limits (e.g. 5 attempts per 15 minutes) on the `/auth/login` route.

- [ ] **No Password Policy Enforcement**
  - **Issue**: In `validateOnboardingPayload`, the password check is just `!isNonEmptyString(password)`. This permits single-character passwords like "a".
  - **Impact**: Extremely weak passwords can be created by administrators, which would be trivial to crack or guess.
  - **Fix**: Implement password complexity logic requiring a certain length (e.g. > 8 characters).

- [ ] **Socket.IO Event Lack of Authentication**
  - **Issue**: `io.on("connection")` in `index.js` allows any client to connect to the Socket channels.
  - **Impact**: Anyone could potentially listen to administrative broadcast events if you emit socket messages to unauthenticated channels.
  - **Fix**: Implement a connection middleware for Socket.io that verifies the user's JWT upon connection.
