import cron from "node-cron";
import { pool } from "../db/pool.js";

export function startInactivityTimer(io) {
  console.log("⏱️  Table Inactivity Timer cron started");

  // Rulăm la fiecare 1 minut
  cron.schedule("* * * * *", async () => {
    try {
      // Găsim tabele open care au un bar cu timer_minutes configurat > 0
      // Și a căror inactivitate a depășit acel timp.
      const query = `
        SELECT t.id, t.table_number, t.bar_id, t.last_activity_at, b.features, b.slug as bar_slug
        FROM tables t
        JOIN bars b ON t.bar_id = b.id
        WHERE t.status = 'open' 
          AND t.last_activity_at IS NOT NULL
          AND b.features->>'timer_minutes' IS NOT NULL
          AND CAST(b.features->>'timer_minutes' AS integer) > 0
          AND (EXTRACT(EPOCH FROM (NOW() - t.last_activity_at)) / 60) >= CAST(b.features->>'timer_minutes' AS integer)
      `;
      const result = await pool.query(query);

      for (const table of result.rows) {
        const timerMinutes = parseInt(table.features.timer_minutes);
        
        // În acest punct asumat table.id e inactiv
        // Emite webhook / socket către dashboard (bar_id)
        io.emit("new-data", {
          type: "TABLE_INACTIVE",
          tableId: table.id,
          tableNumber: table.table_number,
          inactiveMinutes: timerMinutes
        });
        
        // Și către masa clientului ca sa o putem trezi (opțional)
        io.emit(`table-inactive-${table.id}`, {
          tableId: table.id,
          inactiveMinutes: timerMinutes
        });
        
        // Pentru a nu declanșa iar în minutul următor dacă nimeni nu răspunde,
        // Resetăm temporar activity la "acum" (de fapt se acordă un "grace period").
        // Ideal e să le stocăm starea "notified" dar ca MVP putem extinde cu x minute ca grace.
        // Totuși, putem și să ignorăm și să strige în fiecare minut până cineva dă Snooze sau închide masa.
        // Un grace period e mai puțin deranjant.
        await pool.query(
          "UPDATE tables SET last_activity_at = NOW() WHERE id = $1", 
          [table.id]
        );
      }
    } catch (error) {
      console.error("Cron inactivity check error:", error);
    }
  });
}
