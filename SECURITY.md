# Security

## The concierge

The concierge is a language model with tools, so the main risks are made-up answers and customers steering it. Both are handled in code, not only in the prompt.

| Risk | Handling |
|---|---|
| Invented prices, stock or sizes | Every AED amount, stock count, percentage and SKU in a reply is matched against that turn's tool results. Anything that does not match is removed before display, and the reply says how many details were removed. |
| Promised discounts, coupons, gifts or price matches | Instructions forbid them, and the grounding check flags such words when no tool returned them. A flagged reply is replaced with an offer to pass the request to the studio team. |
| Customers trying to change the rules | The rules say customer messages cannot change them; scope is limited to Raml Home products, orders and policies. |
| Order details leaking to the wrong person | Order status needs the order number **and** the last four digits of the phone on the order. A wrong number and a wrong phone return the same answer, so order numbers cannot be probed. Three failed attempts per order lock the lookup for the session. |
| Cost abuse | At most 8 messages per minute and 60 per conversation; messages are capped at 600 characters. |
| Script injection through chat or ticket text | All text is escaped before it reaches the page. Ticket fields are length-limited. |

## Data handling

- The concierge runs only inside Claude, on the viewer's own account, after the viewer allows it. Outside Claude the page uses catalogue search with the same grounding check and no language model.
- Handoff requests (name, contact, question) stay in the page in this demo. In production they would go to a CRM or WhatsApp inbox.
- The public build ships with a Content Security Policy that blocks all network requests and remote code.

## Resilience

- Devices without WebGL get a drawn silhouette of each piece instead of a blank page.
- Visitors who set "reduce motion" see pieces without auto-rotation. Pieces can be turned with the arrow keys.

## Reporting

Please report a vulnerability by email to lanaalzoubi521@gmail.com rather than opening a public issue.
