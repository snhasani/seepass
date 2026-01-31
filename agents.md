# Agent Guidelines

## React 19

- **No more `forwardRef`**: With React 19, `ref` is now passed as a regular prop. You no longer need to wrap components in `forwardRef`. Simply accept `ref` as a prop and pass it to the underlying element.

```tsx
// Before (React 18 and earlier)
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />;
});

// After (React 19)
function Button({
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return <button ref={ref} {...props} />;
}
```
