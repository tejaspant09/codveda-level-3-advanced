# Still UI

Four small React components for focused interfaces: `Button`, `TextField`, `Card`, and `Alert`. JavaScript ES modules; React 18 or later is a peer dependency. The components use native elements, forward refs and native attributes, and include a standalone graphite theme.

**Publication is pending.** `@tejaspant09/still-ui` is an unverified proposed npm scope, not evidence of account ownership or an existing public package. Choose a scope owned by the publisher and update `package.json` and the examples before real publication. No npm publication has been performed.

## Use locally

From the repository root:

```sh
npm install
npm run build:library
npm pack ./level-3/component-library
# In a separate React app, use the actual generated tarball filename:
npm install /absolute/path/to/tejaspant09-still-ui-0.1.0.tgz
```

```jsx
import { Button, TextField, Card, Alert } from '@tejaspant09/still-ui';
import '@tejaspant09/still-ui/styles.css';

export function SessionForm() {
  return (
    <Card title="Your next session">
      <form onSubmit={(event) => event.preventDefault()}>
        <TextField label="Session name" name="session" required
          hint="What would you like to focus on?" />
        <Button type="submit">Save session</Button>
      </form>
      <Alert title="Ready">Choose a task to begin.</Alert>
    </Card>
  );
}
```

## API

All four components accept native element attributes, event handlers, `data-*`, `aria-*`, `children`, `className`, `style`, and a forwarded `ref`. TextField owns its input children; use `label`, `hint`, and `error` for surrounding text. Native props are forwarded to the rendered root element, except TextField forwards them to its input. TextField's `className` styles its outer field wrapper. Unsupported visual variant strings are not part of the public API.

### Button

| Prop | Default | Behavior |
| --- | --- | --- |
| `variant` | `'primary'` | `'primary'` or `'secondary'` |
| `type` | `'button'` | Native `'button'`, `'submit'`, or `'reset'` |
| `disabled` | `false` | Native disabled behavior |
| `loading` | `false` | Disables the control and sets `aria-busy`; retains its label |
| `children` | — | Accessible button content; give icon-only content an `aria-label` |

```jsx
<Button variant="secondary" onClick={cancel}>Cancel</Button>
<Button type="submit" loading={saving}>Save session</Button>
```

Loading has a static visible indicator, so no motion is required. Provide a separate status message when an asynchronous operation completes. Buttons inside forms do not submit unless explicitly given `type="submit"`.

### TextField

| Prop | Default | Behavior |
| --- | --- | --- |
| `label` | — | Visible input label; supply a clear label |
| `id` | Generated | Stable React `useId` input ID; caller IDs must be unique |
| `hint` | — | Supporting content linked with `aria-describedby` |
| `error` | — | Validation text, linked with `aria-describedby`; sets `aria-invalid` |
| `aria-describedby` | — | Existing description IDs are retained before hint/error IDs |
| `aria-invalid` | — | Honored when `error` is absent |
| native input props | Native defaults | Includes `type`, `name`, `value`, `defaultValue`, `onChange`, `disabled`, `required`, `autoComplete`, `placeholder`, `maxLength` |

```jsx
<TextField label="Email" type="email" autoComplete="email" required
  value={email} onChange={(event) => setEmail(event.target.value)}
  hint="Used only for your receipt." error={emailError} />
```

Use either controlled `value` with `onChange` or uncontrolled `defaultValue`. Validation is owned by the consuming application; the component presents supplied errors. Error text is described on focus rather than an automatic live region. Announce submission failures in an Alert when immediate notification is needed. Use one React root or unique `identifierPrefix` values for multiple independent server-rendered roots.

### Card

| Prop | Default | Behavior |
| --- | --- | --- |
| `title` | — | A visible `h2`; a named semantic `section` wraps the content |
| `children` | — | Card content |
| `aria-labelledby` | Generated title ID | Optional custom accessible naming reference |

Without a title, Card renders a plain `div`. Choose it where a second-level heading fits the document hierarchy. Interactive controls belong inside the card; the card itself is not clickable.

```jsx
<Card title="Today"><p>One session planned.</p></Card>
```

### Alert

| Prop | Default | Behavior |
| --- | --- | --- |
| `variant` | `'status'` | `'status'` uses a polite status role; `'danger'` uses assertive alert role |
| `title` | — | Optional visible strong text |
| `children` | — | Message content |
| `role` | Derived from variant | Native role override for application needs |

```jsx
<Alert title="Session saved">Ready when you are.</Alert>
<Alert variant="danger" title="Could not save">Try again.</Alert>
```

Mount or update the message when the event happens. Announcements depend on the assistive technology and timing; reserve danger for urgent errors. Alerts do not move focus or dismiss themselves.

## Theme and accessibility

Import the stylesheet once. All colors and font families are root custom properties; override `--color-paper`, `--color-ink`, `--color-accent`, and related variables in a later stylesheet to theme the components. The stylesheet includes every required token without imports from repository files. Font stacks prefer Host Grotesk and Atkinson Hyperlegible Mono, then local system fallbacks; no remote font request is made. Controls are at least 48px tall. Focus rings, visible labels, semantic regions, and linked validation text are included. Verify contrast again after overriding tokens.

## Develop and inspect

```sh
# Run from the repository root
npm test -- tests/library.test.jsx
npm run storybook
npm run build:storybook
npm run test:package
```

Storybook includes all four components, variants, loading/disabled states, help/error states, and working interaction examples. Its a11y addon assists review; it does not replace keyboard and screen reader checks. Built documentation is served under `/library/`. The workspace root supplies build, Storybook and test dependencies; it is required to build this source checkout. Packed consumers only need React and the resulting package.

## Publish when authorized

1. Confirm npm account and organization ownership with `npm whoami` and the npm account/organization settings. Choose a scope you control; replace the unverified proposed scope throughout this package. Check name availability with `npm view @YOUR_SCOPE/still-ui` (a missing package does not prove scope ownership).
2. Review the API, license, README, version, and packed file list. Run the tests, library build, Storybook build, and clean-consumer package smoke check above.
3. In `level-3/component-library`, run `npm pack --dry-run` and inspect the artifact. Only `dist`, README and LICENSE are intended to ship, alongside npm's mandatory package metadata. Authenticate using `npm login` if required.
4. After explicit publication authorization, run `npm publish --access public`. Use a new version for subsequent releases. Verify the published version using `npm view @YOUR_SCOPE/still-ui version` and install it in a clean React app.

The local package and tarball are deliverables; public npm availability remains pending until these steps are deliberately completed.
