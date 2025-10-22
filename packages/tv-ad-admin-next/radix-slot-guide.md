````markdown
## Radix `<Slot>` / `asChild` 使用指南

Radix 的 `<Slot>` 元件可用於在不新增多餘 DOM 的情況下，將父層的屬性傳遞給子元件。  
它通常搭配 `asChild` 使用，讓子元素決定實際渲染的語義化標籤（如 `h1`–`h6`、`a`、`button` 等），同時保留父元件的樣式與行為。  
參考文件：[Radix Slot Utility](https://www.radix-ui.com/primitives/docs/utilities/slot)

---

### 基本範例

```tsx
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/utils'

type CardTitleProps = React.ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean
}

export function CardTitle({ asChild, className, ...props }: CardTitleProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      data-slot="card-title"
      className={cn('text-h4 font-medium', className)}
      {...props}
    />
  )
}
```

使用方式：

```tsx
<CardTitle>預設標題</CardTitle>

<CardTitle asChild>
  <h2>語義化 H2 標題</h2>
</CardTitle>

<CardTitle asChild>
  <h5 className="text-h5">小標題</h5>
</CardTitle>
```

---

### 行為說明

- `<Slot>` **不會自己渲染元素**，而是將所有屬性（如 `className`、`onClick`、`data-*`）傳給子元件。  
- 子元件可以是語義化標籤（`h1`–`h6`、`a`、`button` 等）或自訂的 React 元件。  
- 若子元件本身已有 `className`，Radix 會自動**合併兩者**。  
- 最終輸出的 DOM 範例：

```html
<h2 data-slot="card-title" class="text-h4 font-medium">語義化 H2 標題</h2>
```

---

### 常見用途

| 使用情境 | 說明 |
|-----------|------|
| `asChild` | 讓子元件決定最終的 HTML 標籤 |
| 類別合併 | 父層與子層的 `className` 會自動合併 |
| 可存取性 | 保留子元件的語義結構與可存取性 |
| Ref 傳遞 | 可與 `React.forwardRef` 搭配使用 |

---

### 進階組合範例

當元件有多個區塊需要區分哪些子元素能接收 slot 屬性時，可使用 `Slot.Slottable`：

```tsx
import { Slot } from '@radix-ui/react-slot'

function ComplexComponent({ asChild, left, right, children, ...props }) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp {...props}>
      {left}
      <Slot.Slottable>{children}</Slot.Slottable>
      {right}
    </Comp>
  )
}
```

---

### 最佳實務建議

- 使用 `asChild` 時，子元素必須是**單一合法的 React 元素**（不能是 fragment 或文字）。  
- 子元素必須能接受傳遞的屬性（如 `className`、`onClick`）。  
- 保持語義正確，例如不要把 `h1` 包在 `button` 裡。  
- 若使用 Tailwind CSS，要注意 Radix 的類別合併是**字串拼接**，不會自動處理衝突樣式（例如 `text-sm` 與 `text-lg`）。

---

**參考來源：**  
- [Radix UI 官方文件 – Slot Utility](https://www.radix-ui.com/primitives/docs/utilities/slot)  
- [Radix Composition 指南](https://www.radix-ui.com/primitives/docs/guides/composition)
````

````markdown
## Radix `<Slot>` / `asChild` Usage Guide

The Radix `<Slot>` component allows prop forwarding and composition without adding extra DOM elements.  
It is primarily used with the `asChild` prop to let the child define the semantic tag (`h1`–`h6`, `a`, `button`, etc.) while preserving the parent’s styles and behavior.  
Radix documentation: [Slot Utility](https://www.radix-ui.com/primitives/docs/utilities/slot)

---

### Basic Example

```tsx
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/utils'

type CardTitleProps = React.ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean
}

export function CardTitle({ asChild, className, ...props }: CardTitleProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      data-slot="card-title"
      className={cn('text-h4 font-medium', className)}
      {...props}
    />
  )
}
```

Usage:

```tsx
<CardTitle>Default Title</CardTitle>

<CardTitle asChild>
  <h2>Semantic H2 Title</h2>
</CardTitle>

<CardTitle asChild>
  <h5 className="text-h5">Small Heading</h5>
</CardTitle>
```

---

### Behavior Notes

- `<Slot>` does **not render its own element** — it merges props (like `className`, `onClick`, `data-*`) into its child.  
- Child elements can be semantic tags (`h1`–`h6`, `a`, `button`, etc.) or custom React components.  
- If the child already has a `className`, Radix **automatically merges** both classes.  
- The final DOM output example:

```html
<h2 data-slot="card-title" class="text-h4 font-medium">Semantic H2 Title</h2>
```

---

### Common Use Cases

| Case | Description |
|------|--------------|
| `asChild` | Enables the child to define the rendered HTML tag |
| Class merging | Parent `className` and child `className` are merged |
| Accessibility | Keeps semantic meaning of child elements (e.g., headings, links) |
| Ref forwarding | Works with `React.forwardRef` components |

---

### Advanced Composition Example

You can use `Slot.Slottable` to handle multiple children in a composite layout:

```tsx
import { Slot } from '@radix-ui/react-slot'

function ComplexComponent({ asChild, left, right, children, ...props }) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp {...props}>
      {left}
      <Slot.Slottable>{children}</Slot.Slottable>
      {right}
    </Comp>
  )
}
```

---

### Best Practices

- Only use `asChild` with a **single valid React element** (no fragments or text).  
- The child element must accept forwarded props (like `className`, `onClick`).  
- Maintain semantic correctness — e.g., avoid wrapping `h1` inside a `button`.  
- When using Tailwind CSS, be aware that class merging is **string-based**; it does not resolve conflicting utilities (`text-sm` vs `text-lg`).

---

**Reference:**  
- [Radix UI Docs – Slot Utility](https://www.radix-ui.com/primitives/docs/utilities/slot)  
- [Radix Composition Guide](https://www.radix-ui.com/primitives/docs/guides/composition)
````
