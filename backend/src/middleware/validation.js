function fail(res, message, details = []) {
  return res.status(400).json({
    error: message,
    details,
  });
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value) {
  return typeof value === "boolean";
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
        errors.push(`menu[${categoryIndex}].category must be a non-empty string`);
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

  if (!Number.isInteger(bar_id) || bar_id <= 0) {
    errors.push("bar_id must be a positive integer");
  }
  if (!Number.isInteger(table_id) || table_id <= 0) {
    errors.push("table_id must be a positive integer");
  }
  if (!Array.isArray(items) || items.length === 0) {
    errors.push("items must be a non-empty array");
  } else {
    items.forEach((item, index) => {
      if (!Number.isInteger(item?.id) || item.id <= 0) {
        errors.push(`items[${index}].id must be a positive integer`);
      }
      if (!Number.isInteger(item?.quantity) || item.quantity <= 0) {
        errors.push(`items[${index}].quantity must be a positive integer`);
      }
      if (!isPositiveNumber(item?.price)) {
        errors.push(`items[${index}].price must be a positive number`);
      }
    });
  }
  if (!isPositiveNumber(total_amount)) {
    errors.push("total_amount must be a positive number");
  }

  if (errors.length > 0) {
    return fail(res, "Invalid order payload", errors);
  }

  return next();
}

export function validateCreateRequestPayload(req, res, next) {
  const { bar_id, table_id, type, payment_method } = req.body ?? {};
  const errors = [];

  if (!Number.isInteger(bar_id) || bar_id <= 0) {
    errors.push("bar_id must be a positive integer");
  }
  if (!Number.isInteger(table_id) || table_id <= 0) {
    errors.push("table_id must be a positive integer");
  }
  if (!isNonEmptyString(type)) {
    errors.push("type is required and must be a non-empty string");
  }
  if (payment_method !== undefined && !isNonEmptyString(payment_method)) {
    errors.push("payment_method must be a non-empty string when provided");
  }

  if (errors.length > 0) {
    return fail(res, "Invalid request payload", errors);
  }

  return next();
}

export function validateToggleProductPayload(req, res, next) {
  const { productId } = req.params ?? {};
  const { is_available } = req.body ?? {};
  const errors = [];

  const parsedProductId = Number(productId);
  if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
    errors.push("productId must be a positive integer");
  }
  if (!isBoolean(is_available)) {
    errors.push("is_available must be a boolean");
  }

  if (errors.length > 0) {
    return fail(res, "Invalid stock toggle payload", errors);
  }

  return next();
}
