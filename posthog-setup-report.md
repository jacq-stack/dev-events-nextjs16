# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the DevEvent Next.js App Router project. PostHog was installed (`posthog-js` and `posthog-node`), initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), and configured with a reverse proxy through Next.js rewrites. Two client-side event captures were added to track core user engagement actions: exploring available events and clicking into event detail pages. Environment variables were written to `.env.local` and excluded from version control.

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the 'Explore Events' button on the homepage to scroll down to the events list | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view the event detail page (with properties: `event_title`, `event_slug`, `event_location`, `event_date`) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard - Analytics basics**: https://eu.posthog.com/project/139646/dashboard/564329
- **Event Engagement Trends** (daily line chart of both events): https://eu.posthog.com/project/139646/insights/WoaDjwBu
- **Event Discovery Funnel** (conversion from explore click → event card click): https://eu.posthog.com/project/139646/insights/bNQvDZ45
- **Unique Users Engaging Weekly** (weekly DAU clicking event cards): https://eu.posthog.com/project/139646/insights/EQhQtLCX
- **Most Clicked Events by Title** (bar chart broken down by event title): https://eu.posthog.com/project/139646/insights/EPuuWd7G

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
