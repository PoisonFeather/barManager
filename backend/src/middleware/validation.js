function fail(res, message, details = []) {
  return res.status(400).json({
    error: message,
    details,
  });
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isPositiveNumberLike(value) {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0;
}

function isPositiveIntegerLike(value) {
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isInteger(parsed) && parsed > 0;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isValidEntityId(value) {
  return isPositiveIntegerLike(value) || isNonEmptyString(value);
}

export function validateOnboardingPayload(req, res, next) {
  // 1. Am adăugat noile câmpuri aici
  const { bar_name, slug, menu, username, password, bar_number_tables } =
    req.body ?? {};
  const errors = [];

  // --- VALIDĂRI DATE BAR ---
  if (!isNonEmptyString(bar_name)) {
    errors.push("Numele barului (bar_name) este obligatoriu.");
  }
  if (!isNonEmptyString(slug)) {
    errors.push("Link-ul (slug) este obligatoriu.");
  }
  if (!isPositiveIntegerLike(bar_number_tables)) {
    errors.push("Numărul de mese trebuie să fie un număr întreg pozitiv.");
  }

  // --- VALIDĂRI CONT ADMINISTRATOR ---
  if (!isNonEmptyString(username)) {
    errors.push("Numele de utilizator este obligatoriu.");
  }
  if (!isNonEmptyString(password)) {
    errors.push("Parola este obligatorie.");
  }

  // --- VALIDĂRI MENIU ---
  if (!Array.isArray(menu) || menu.length === 0) {
    errors.push(
      "Meniul este obligatoriu și trebuie să conțină cel puțin o categorie."
    );
  } else {
    menu.forEach((categoryItem, categoryIndex) => {
      if (!isNonEmptyString(categoryItem?.category)) {
        errors.push(`Categoria #${categoryIndex + 1} trebuie să aibă un nume.`);
      }

      if (
        !Array.isArray(categoryItem?.products) ||
        categoryItem.products.length === 0
      ) {
        errors.push(
          `Categoria '${
            categoryItem?.category || categoryIndex
          }' trebuie să aibă cel puțin un produs.`
        );
      } else {
        categoryItem.products.forEach((product, productIndex) => {
          if (!isNonEmptyString(product?.name)) {
            errors.push(
              `Un produs din categoria '${categoryItem.category}' nu are nume completat.`
            );
          }
          if (!isPositiveNumberLike(product?.price)) {
            // 👈 Am schimbat în isPositiveNumberLike ca să fim mai flexibili dacă vine string din greșeală
            errors.push(
              `Produsul '${
                product?.name || "fără nume"
              }' trebuie să aibă un preț valid mai mare ca 0.`
            );
          }
        });
      }
    });
  }

  if (errors.length > 0) {
    return fail(res, "Invalid onboarding payload", errors);
  }

  // Convertim la tipurile corecte ca să ajuți Service-ul
  req.body.bar_number_tables = Number(bar_number_tables);
  req.body.menu = menu.map((cat) => ({
    ...cat,
    products: cat.products.map((prod) => ({
      ...prod,
      price: Number(prod.price),
    })),
  }));

  return next();
}

export function validateCreateOrderPayload(req, res, next) {
  const { bar_id, table_id, items, total_amount } = req.body ?? {};
  const errors = [];
  const normalizedItems = [];

  if (!isValidEntityId(bar_id)) {
    errors.push("bar_id is required and must be a valid identifier");
  }
  if (!isValidEntityId(table_id)) {
    errors.push("table_id is required and must be a valid identifier");
  }
  if (!Array.isArray(items) || items.length === 0) {
    errors.push("items must be a non-empty array");
  } else {
    items.forEach((item, index) => {
      const rawItemId = item?.id ?? item?.product_id;
      if (!isValidEntityId(rawItemId)) {
        errors.push(`items[${index}].id must be a valid identifier`);
      }
      if (!isPositiveIntegerLike(item?.quantity)) {
        errors.push(`items[${index}].quantity must be a positive integer`);
      }
      if (!isPositiveNumberLike(item?.price)) {
        errors.push(`items[${index}].price must be a positive number`);
      }

      if (
        isValidEntityId(rawItemId) &&
        isPositiveIntegerLike(item?.quantity) &&
        isPositiveNumberLike(item?.price)
      ) {
        normalizedItems.push({
          id: rawItemId,
          quantity: Number(item.quantity),
          price: Number(item.price),
          notes: item.notes || null,
        });
      }
    });
  }
  if (!isPositiveNumberLike(total_amount)) {
    errors.push("total_amount must be a positive number");
  }

  if (errors.length > 0) {
    return fail(res, "Invalid order payload", errors);
  }

  // Normalize numeric-like payload values for downstream services/repositories.
  req.body = {
    ...req.body,
    bar_id,
    table_id,
    total_amount: Number(total_amount),
    items: normalizedItems,
  };

  return next();
}

export function validateCreateRequestPayload(req, res, next) {
  const { bar_id, payment_method, session_token, table_id, type } =
    req.body ?? {};
  const errors = [];
  //console.log(req.body);
  if (!isValidEntityId(bar_id)) {
    errors.push("bar_id is required and must be a valid identifier");
  }
  if (!isValidEntityId(table_id)) {
    errors.push("table_id is required and must be a valid identifier");
  }
  if (!isNonEmptyString(type)) {
    errors.push("type is required and must be a non-empty string");
  }
  console.log(payment_method);
  if (type === "bill" && !isNonEmptyString(payment_method)) {
    errors.push("payment_method is required for bill requests");
  }

  if (errors.length > 0) {
    return fail(res, "Invalid request payload", errors);
  }

  if (type !== "bill") {
    req.body.payment_method = null;
  }
  return next();
}

export function validateToggleProductPayload(req, res, next) {
  const { productId } = req.params ?? {}; // ID-ul vine din URL
  const { is_available } = req.body ?? {};
  const errors = [];

  if (!isValidEntityId(productId)) {
    errors.push(
      "productId must be a valid identifier (integer or string/UUID)"
    );
  }

  if (!isBoolean(is_available)) {
    errors.push("is_available must be a boolean");
  }

  if (errors.length > 0) {
    return fail(res, "Invalid stock toggle payload", errors);
  }

  return next();
}
