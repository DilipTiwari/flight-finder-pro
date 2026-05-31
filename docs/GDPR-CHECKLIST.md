# GDPR Checklist

This starter is designed to avoid collecting personal data by default.

## Current version

- [x] No user account creation
- [x] No database storage of searches
- [x] No payment processing
- [x] Google Analytics is optional and consent-gated
- [x] Privacy page included
- [x] Analytics can be rejected without blocking flight search
- [x] IP anonymization enabled in GA configuration

## Before public launch

- [ ] Add your legal business name to the privacy page
- [ ] Add contact email for privacy requests
- [ ] Add affiliate disclosure
- [ ] List subprocessors, such as hosting provider, analytics provider and API provider
- [ ] Confirm your cookie banner wording with legal guidance
- [ ] Add Terms of Use if monetizing through affiliates

## If adding user accounts later

- [ ] Add explicit account consent
- [ ] Add email verification
- [ ] Add password reset or passwordless login
- [ ] Add export-my-data flow
- [ ] Add delete-my-account flow
- [ ] Add data retention schedule
- [ ] Add database encryption and row-level access controls
- [ ] Add audit logs for critical account changes
- [ ] Update privacy page with exact personal data collected

## If adding price alerts later

- [ ] Store only required alert fields
- [ ] Add opt-in email consent
- [ ] Add unsubscribe link in every email
- [ ] Add delete alert feature
- [ ] Set a retention period for expired alerts
- [ ] Document how often alert checks run
