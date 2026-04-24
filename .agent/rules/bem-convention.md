---
trigger: always_on
---

# BEM Naming Convention Rules

## 1. Tổng quan

BEM là viết tắt của:

- **Block**: Khối độc lập
- **Element**: Thành phần con của block
- **Modifier**: Biến thể hoặc trạng thái

Cú pháp chung:

```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

---

## 2. Quy tắc đặt tên

### 2.1 Block

- Là thành phần độc lập, có ý nghĩa riêng
- Viết bằng **kebab-case**
- Không phụ thuộc vào context bên ngoài

✅ Ví dụ:

```
.header
.card
.button
.navbar
```

❌ Không nên:

```
.main-header (nếu không cần thiết)
.blue-button (mang ý nghĩa style)
```

---

### 2.2 Element

- Là thành phần con trực tiếp của block
- Dùng dấu `__` (2 dấu gạch dưới)

Cú pháp:

```
.block__element
```

✅ Ví dụ:

```
.card__title
.card__image
.navbar__item
.navbar__link
```

❌ Không nên:

```
.card-title
.navbar-item
```

---

### 2.3 Modifier

- Dùng để biểu thị **trạng thái hoặc biến thể**
- Dùng dấu `--` (2 dấu gạch ngang)

Cú pháp:

```
.block--modifier
.block__element--modifier
```

✅ Ví dụ:

```
.button--primary
.button--disabled
.card__title--large
.navbar__item--active
```

---

## 3. Nguyên tắc quan trọng

### 3.1 Không lồng sâu (No deep nesting)

❌ Sai:

```
.card__header__title
```

✅ Đúng:

```
.card__title
```

---

### 3.2 Không phụ thuộc vào HTML structure

❌ Sai:

```
.header div span {}
```

✅ Đúng:

```
.header__title {}
```

---

### 3.3 Không dùng tag selector

❌ Sai:

```
button.primary {}
```

✅ Đúng:

```
.button {}
.button--primary {}
```

---

### 3.4 Không encode style vào tên class

❌ Sai:

```
.text-red
.big-box
```

✅ Đúng:

```
.alert--error
.card--large
```

---

### 3.5 Một block = một responsibility

- Không gộp nhiều logic vào 1 block

❌ Sai:

```
.header-footer
```

✅ Đúng:

```
.header
.footer
```

---

## 4. Cấu trúc ví dụ

HTML:

```
<div class="card card--featured">
  <img class="card__image" />
  <h2 class="card__title">Title</h2>
  <p class="card__description">Description</p>
  <button class="card__button card__button--primary">Buy</button>
</div>
```

---

## 5. Prefix cho JavaScript

- Class dùng cho JS nên tách riêng bằng prefix `js-`
- Không dùng để styling

✅ Ví dụ:

```
<button class="button js-submit-form"></button>
```

---

## 6. Quy ước viết

- Dùng **lowercase**
- Dùng dấu `-` để ngăn cách từ
- Không viết tắt khó hiểu

❌ Sai:

```
.btn-pri
```

✅ Đúng:

```
.button--primary
```

---

## 7. Best Practices

- Ưu tiên class thay vì id
- Giữ class ngắn nhưng rõ nghĩa
- Tránh over-engineering BEM (quá dài)
- Luôn nghĩ theo component

---

## 8. Checklist khi đặt tên

- [ ] Có phải block độc lập không?
- [ ] Có đang dùng đúng `__` cho element?
- [ ] Có đang dùng đúng `--` cho modifier?
- [ ] Có tránh phụ thuộc HTML không?
- [ ] Tên có mô tả đúng ý nghĩa không?

---

## 9. Ví dụ tổng hợp

```
.button
.button--primary
.button--disabled

.form
.form__input
.form__input--error

.navbar
.navbar__item
.navbar__item--active
```

---
