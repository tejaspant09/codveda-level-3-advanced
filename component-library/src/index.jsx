import { forwardRef, useId } from "react";

const classes = (...values) => values.filter(Boolean).join(" ");

/** Native button. Loading preserves its name and prevents repeated actions. */
export const Button = forwardRef(function Button(
  {
    variant = "primary",
    loading = false,
    disabled = false,
    type = "button",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes("still-button", `still-button--${variant}`, className)}
    >
      {loading && (
        <span className="still-button__indicator" aria-hidden="true">
          ·
        </span>
      )}
      {children}
    </button>
  );
});

/** Label, help and validation remain connected through stable unique IDs. */
export const TextField = forwardRef(function TextField(
  {
    label,
    hint,
    error,
    id,
    className,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || `still-field-${generatedId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const descriptions = classes(describedBy, hint && hintId, error && errorId);
  return (
    <div className={classes("still-field", className)}>
      <label className="still-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        id={inputId}
        className="still-field__input"
        aria-invalid={error ? true : invalid}
        aria-describedby={descriptions || undefined}
      />
      {hint && (
        <p className="still-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="still-field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
});

/** A semantic section when titled; a plain div when used as a visual container. */
export const Card = forwardRef(function Card(
  { title, children, className, "aria-labelledby": labelledBy, ...props },
  ref,
) {
  const titleId = `still-card-${useId()}`;
  const Element = title ? "section" : "div";
  return (
    <Element
      {...props}
      ref={ref}
      className={classes("still-card", className)}
      aria-labelledby={labelledBy || (title ? titleId : undefined)}
    >
      {title && (
        <h2 className="still-card__title" id={titleId}>
          {title}
        </h2>
      )}
      {children}
    </Element>
  );
});

/** Status messages announce politely; danger messages announce assertively. */
export const Alert = forwardRef(function Alert(
  { variant = "status", title, children, role, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role={role || (variant === "danger" ? "alert" : "status")}
      className={classes("still-alert", `still-alert--${variant}`, className)}
    >
      {title && <strong className="still-alert__title">{title}</strong>}
      {children && <div>{children}</div>}
    </div>
  );
});
