# Security Policy

## Supported Versions

This project is a boilerplate/starter template rather than a versioned library — there is
no long-term support matrix. Security fixes are applied to the `main` branch only. If
you've built a project from this template, pull the relevant fix into your own codebase
rather than expecting an upstream release.

| Branch | Supported |
| ------ | --------- |
| `main` | ✅        |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, report it privately using one of these methods:

1. **GitHub Private Vulnerability Reporting** (preferred): open a report via the
   [Security tab](https://github.com/sushantrahate/express-typescript-prisma-postgresql/security/advisories/new)
   of this repository.
2. **Email**: [sushantrahate15@gmail.com](mailto:sushantrahate15@gmail.com) with a
   description of the issue, steps to reproduce, and any relevant proof-of-concept.

Please include:

- The affected file(s) or endpoint(s)
- Steps to reproduce, or a minimal proof-of-concept
- The potential impact (what an attacker could do)

### What to expect

- Acknowledgement within a few days of your report.
- An assessment of the issue and, if confirmed, a fix or mitigation plan.
- Credit in the fix's commit/release notes, unless you'd prefer to remain anonymous.

## Scope

This template ships example authentication (JWT), input validation (Zod), rate
limiting, and security headers (Helmet) as a starting point — review and adapt these for
your own production requirements before deploying. Reports about the *demo* `.env.dev.example`
values or other clearly non-production placeholder data are out of scope.
