// // 4. Toggle stoc produs (doar pentru barman, nu afectează comenzile deja plasate, doar dacă e disponibil sau nu pentru viitor)
// const toggleStock = async (prodId: string, currentStatus: boolean) => {
//     const newStatus = !currentStatus;
//     try {
//       const res = await fetch(
//         `http://localhost:3001/products/${prodId}/toggle`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ is_available: newStatus }),
//         }
//       );
//       if (res.ok) {
//         setBarData((prev: any) => ({
//           ...prev,
//           categories: prev.categories.map((cat: any) => ({
//             ...cat,
//             products: cat.products.map((p: any) =>
//               p.id === prodId ? { ...p, is_available: newStatus } : p
//             ),
//           })),
//         }));
//       }
//     } catch (err) {
//       alert("Eroare stoc.");
//     }
//   };
//   const prevTotalAlerts = useRef(0);


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const stockService = {
    toggleStock: async (prodId: string | number, currentStatus: boolean) => {
      const newStatus = !currentStatus;
      
      // ✅ Conversie forțată la număr întreg (integer)
      //const numericId = parseInt(prodId.toString(), 10);
  
      // Verificăm dacă conversia a eșuat (dacă ID-ul chiar nu e număr)
    //   if (isNaN(numericId)) {
    //     console.error("Eroare: ID-ul produsului nu este un număr valid!");
    //     return null;
    //   }
  
      try {
        const res = await fetch(`${API_BASE_URL}/products/${prodId}/toggle`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_available: newStatus }),
        });
  
        if (!res.ok) {
          // Dacă serverul dă eroare de validare, vedem aici detaliile
          const errorData = await res.json();
          console.error("Backend validation error:", errorData);
          return null;
        }
  
        return newStatus;
      } catch (err) {
        console.error("Stock Service Network Error:", err);
        return null;
      }
    },
  };