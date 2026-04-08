# Front Desk Agent Configuration

## System Paths
- **Himalaya binary:** `~/.local/bin/himalaya`
- **Himalaya config:** `~/.config/himalaya/config.toml`
- **Email account:** `gmail`

## API Configuration
- **Clinic API URL:** `http://localhost:3000`
- **Clinic API Key:** `clinic-secret-key-123`

## Skill Location
- **Skill dir:** `~/.openclaw/workspace/skills/front-desk/`
- **Files:** SKILL.md, SOUL.md, FAQ.md, CONFIG.md

## Cron Job
- **Check script:** `/home/jarl/check_reservations.sh`
- **Schedule:** Every 5 minutes (`*/5 * * * *`)
- **Log:** `/home/jarl/.openclaw/reservation_emails.log`
- **Last checked count:** `/home/jarl/.openclaw/last_checked_email`

## Status
- ✅ Himayala installed and working
- ✅ Gmail account configured (clinicdevtest@gmail.com)
- ✅ Clinic API running on localhost:3000
- ✅ MongoDB running (Docker)
- ✅ Cron job for email checking active
