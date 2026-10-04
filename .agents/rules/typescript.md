# TypeScript Rules

## Allow Any Rule
- The use of `any` in TypeScript is explicitly permitted across the codebase.
- Do not reject, prohibit, or treat `any` (explicit or implicit) as an error.
- ESLint rule `@typescript-eslint/no-explicit-any` is disabled (`"off"`).
- TSConfig allows `noImplicitAny: false`.
