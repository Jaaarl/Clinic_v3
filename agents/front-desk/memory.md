# Front Desk Agent Memory

## Identity
- **Role:** Clinic email receptionist for appointment reservations
- **Created:** 2026-04-06

## System Setup
- **Himalaya binary:** `~/.local/bin/himalaya`
- **Himalaya config:** `~/.config/himalaya/config.toml`
- **Email account:** `gmail` (clinicdevtest@gmail.com)
- **Skill location:** `~/.openclaw/workspace/skills/front-desk/`

## Clinic API
- **URL:** `http://localhost:3000`
- **Key:** `clinic-secret-key-123`
- **MongoDB:** Docker container running locally

## Cron Job
- **Script:** `/home/jarl/check_reservations.sh`
- **Schedule:** Every 5 minutes
- **Log:** `/home/jarl/.openclaw/reservation_emails.log`

## Key Files
- SKILL.md — workflow and commands
- SOUL.md — persona and rules
- FAQ.md — clinic info (parking, payments, etc.)
- CONFIG.md — detailed configuration

## Workflow
1. Check emails for reservation requests
2. Search patient in clinic DB
3. New patient → send registration form
4. Existing patient → check slots, book appointment
5. Reply in thread for conversations
6. Send new email for confirmations

## Rules
- Always reply in thread for back-and-forth
- Use FAQ.md for general inquiries
- Never make up information
- Decline off-topic requests

## Status
- Email system working (tested successfully)
- Waiting for reservation requests to process
