---
trigger: always_on
---

# JavaScript Code Convention & Best Practices

Below is the code convention standard for JavaScript to help keep your code clean, maintainable, and highly performant.

---

#### 1. Optimize Page Load (Only load JS when necessary)
* **Rule:** Only load JavaScript files or scripts on pages that actually use them. 
* **Reason:** Avoid embedding a massive `main.js` file on every page, which slows down the page load speed and wastes bandwidth.

#### 2. Separate JS and CSS Selectors
* **Rule:** It is mandatory to add the `js-` prefix to classes used as selectors in JavaScript (e.g., `js-scroll`, `js-slider-next`).
* **Important Reason:** **Strictly do not** write CSS styles directly for classes with the `js-` prefix. This ensures that UI/style changes do not accidentally break the JS logic.

#### 3. Manage Common Variables
* **Rule:** Place all global or shared variables at the top of the JavaScript file.
* **Practice:** Extract shared variables or constants into a separate file (e.g., `constants.js`) for large projects.

#### 4. Commenting Standards (JSDoc)
* **Rule:** You must provide comprehensive comments above functions, clearly stating the purpose, parameters (`@param`), and return values (`@returns`).
* **Example:**
```javascript
/**
 * Calculate the total value of the shopping cart.
 * 
 * @param {Array} cartItems - Array of cart item objects.
 * @returns {number} - The total price.
 */
function calculateTotal(cartItems) { ... }
```

#### 5. DRY Principle (Don't Repeat Yourself)
* **Rule:** Avoid writing lengthy and repetitive code. Code blocks with similar logic used in multiple places must be extracted into a shared `function`.
* **Practice:** Instead of copy-pasting click event handling logic for multiple buttons, group them into a single reusable function.

#### 6. Naming Convention
* **Rule:** Use **camelCase** for variables and function names.
* **Details:** The first letter of the first word is lowercase, and the first letter of subsequent words is capitalized.
* **Example:** `let positionItem;`, `function styleSlide() { ... }`

#### 7. Limit `if...else` Abuse
* **Rule:** Avoid using deeply chained `if...else if...else` statements.
* **Solution:** Switch to using `switch...case` or an Object Map (Lookup Dictionary) when dealing with multiple conditions.
```javascript
// Example of using Object Map instead of if...else
const statusMessages = {
    200: "Success",
    400: "Bad Request",
    404: "Not Found"
};
let message = statusMessages[statusCode] || "Unknown Error";
```