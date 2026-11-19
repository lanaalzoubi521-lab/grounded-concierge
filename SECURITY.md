# Security

## The concierge

The concierge is a language model with tools, so the main risks are made-up answers and customers steering it. Both are handled in code, not only in the prompt.

| Risk | Handling |
|---|---|
| Invented prices, stock or sizes | Every price (AED, Dhs, dirhams, درهم; Latin, Arabic and Persian digits), stock count, size, percentage and SKU in a reply is tied to the product named in the same sentence and compared with that turn's tool results. Prices written in words are refused. The reply is not shown at all until it has passed; anything that fails is removed at its exact position, and the reply says how many details were removed. |
| Promised discounts, coupons, gifts or price matches | Instructions forbid them, and the grounding check flags promise words in English and Arabic (including plurals, "half price", "buy one get one", تخفيض, عرض خاص). Refusals such as "I can't offer a discount" and the delivery policy's free-delivery wording are recognised and not flagged. A flagged reply is replaced with an offer to pass the request to the studio team. |
| Customers trying to change the rules | The rules say customer messages cannot change them, and scope is limited to Raml Home products, orders and policies. The page's model interface has no separate system prompt, so the rules travel as the first turn of every call; that is why the grounding check in code, not the prompt, is the last line of defence. |
| Order details leaking to the wrong person | Order status needs the order number **and** the last four digits of the phone on the order, and a wrong number and a wrong phone give the same answer. Three failed attempts per order lock the lookup until the page is reloaded. **Demo only:** the sample orders ship inside the page so it works without a server. In production the lookup and the attempt counter must run on the server, behind the same tool interface. |
| Cost abuse | At most 8 messages per minute and 40 per page visit (switching language does not reset it); messages are capped at 600 characters; at most 3 handoff requests per conversation. These are client-side limits for the demo; production needs the same limits on the server. |
| Script injection through chat or ticket text | All text is escaped before it reaches the page. Ticket fields are length-limited. |

## Data handling

- The concierge runs only inside Claude, on the viewer's own account, after the viewer allows it. Outside Claude the page uses catalogue search with the same grounding check and no language model.
- Handoff requests (name, contact, question) stay in the page in this demo. In production they would go to a CRM or WhatsApp inbox.
- The public build ships with a Content Security Policy that blocks network requests (fetch, XHR, WebSocket) and all remote code. It reduces, but does not remove, the impact of an injected script, which is why every value is also escaped before display.

## Resilience

- Devices without WebGL get a drawn silhouette of each piece instead of a blank page.
- Visitors who set "reduce motion" see pieces without auto-rotation. Pieces can be turned with the arrow keys.

## Reporting

Please report a vulnerability by email to lanaalzoubi521@gmail.com rather than opening a public issue.
