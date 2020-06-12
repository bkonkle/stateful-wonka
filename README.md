# Cultivar

## Idea

Handle requests from many different sources, and compose a response using many handlers.

### Goals

- Portable: Should work with many different backends, like Express, Koa, and Hapi, and maybe native OCaml libraries.
- Opinionated, but replaceable: Pieces should be able to be removed and substituted with other solutions without issue.
- Batteries-included: Should include a full toolkit to handle everyday API concerns.

### Sources

- HTTP requests
- Messages from a queue
- WebSocket events
- WebRTC events?

### Features

- Routing
- Authentication
- Validation
- Pagination
- Database Access
- Sessions
- Authorization
