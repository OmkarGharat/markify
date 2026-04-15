# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: Yes |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do not** open a public issue for security vulnerabilities.

Instead, please send an email to: security@markify.com

Include the following information:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes

### What to Expect

- We will acknowledge receipt within 24 hours
- We will provide a detailed response within 48 hours
- We will work with you to understand and fix the issue
- We will coordinate disclosure timeline

### Security Best Practices

This project follows these security practices:

- **Client-side processing**: All file processing happens in the browser
- **No data transmission**: No data is sent to external servers
- **Input validation**: All user inputs are validated
- **Content Security Policy**: Strict CSP headers are enforced
- **Regular updates**: Dependencies are kept up to date
- **Code review**: All changes go through security review

### Dependency Management

We regularly update dependencies to address security vulnerabilities:

- Automated dependency scanning
- Regular security audits
- Prompt patching of known vulnerabilities

### Data Privacy

- No user data is stored or transmitted
- All processing is client-side
- No tracking or analytics by default
- No cookies or local storage for sensitive data

## Security Features

### Built-in Protections

- File size limits (10 MB maximum)
- File type validation
- Input sanitization
- XSS prevention
- CSRF protection

### Headers

- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

## Responsible Disclosure

We appreciate responsible disclosure and will:

- Credit you for the discovery
- Work with you on a fix
- Coordinate public disclosure
- Provide updates on progress

## Security Updates

Security updates will be:

- Released as soon as possible
- Clearly marked in release notes
- Backported to supported versions
- Communicated through security advisories

## Contact

For security-related questions or concerns:

- Email: security@markify.com
- GitHub Security: [Security Advisories](https://github.com/yourusername/markify/security/advisories)

---

Thank you for helping keep Markify secure! 🔒
