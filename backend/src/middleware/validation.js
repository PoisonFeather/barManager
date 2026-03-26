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
  const { bar_name, slug, menu } = req.body ?? {};
  const errors = [];

  if (!isNonEmptyString(bar_name)) {
    errors.push("bar_name is required and must be a non-empty string");
  }

  if (!isNonEmptyString(slug)) {
    errors.push("slug is required and must be a non-empty string");
  }

  if (!Array.isArray(menu)) {
    errors.push("menu is required and must be an array");
  } else {
    menu.forEach((categoryItem, categoryIndex) => {
      if (!isNonEmptyString(categoryItem?.category)) {
        errors.push(
          `menu[${categoryIndex}].category must be a non-empty string`
        );
      }

      if (
        categoryItem?.products !== undefined &&
        !Array.isArray(categoryItem.products)
      ) {
        errors.push(`menu[${categoryIndex}].products must be an array`);
      }

      if (Array.isArray(categoryItem?.products)) {
        categoryItem.products.forEach((product, productIndex) => {
          if (!isNonEmptyString(product?.name)) {
            errors.push(
              `menu[${categoryIndex}].products[${productIndex}].name must be a non-empty string`
            );
          }
          if (!isPositiveNumber(product?.price)) {
            errors.push(
              `menu[${categoryIndex}].products[${productIndex}].price must be a positive number`
            );
          }
        });
      }
    });
  }

  if (errors.length > 0) {
    return fail(res, "Invalid onboarding payload", errors);
  }

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
