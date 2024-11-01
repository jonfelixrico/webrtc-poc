# Miscallaneous

## Technical Decisions

### Outdated `nanoid` (latest is v5, using v3)

We're using `nanoid@^3` because `nanoid@latest` doesn't seem to be working with NestJS because of import technologies.

We're not going to bother resolving this problem with `nanoid@latest` since `nanoid@^3` works as fine for our use case.
