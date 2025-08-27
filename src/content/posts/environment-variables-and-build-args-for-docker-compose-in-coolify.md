---
title: Environment variables and build args for Docker Compose in Coolify
datePublished: 2024-08-20
dateUpdated: 2025-08-27
tags: ["coolify"]
---

Any environment variables you want to set in Coolify UI should be defined in
`docker-compose.yaml` with the following syntax:

```yaml
services:
  myservice:
    environment:
      # Gets passed to the container but will not be visible in Coolify's UI
      - SOME_HARDCODED_VALUE=hello
      # Creates an uninitialized environment variable editable in Coolify's UI
      - SOME_VARIABLE=${SOME_VARIABLE}
      # Creates an environment variable of value "hello" editable in Coolify's UI
      - SOME_DEFAULT_VARIABLE=${SOME_DEFAULT_VARIABLE:-hello}
```

See [Coolify Docs on defining environment
variables](https://coolify.io/docs/knowledge-base/docker/compose#defining-environment-variables)
for more info.

### What about `.env` files?

As far as Coolify is concerned, `docker-compose.yaml` is the single source of
truth and all env variables should be defined in it. Using `.env.example` and
`.env` is still useful for local development especially if you're not running a
container in development (because then variables from `docker-compose.yaml` are
not available).

## Setting variables in Coolify UI

Navigate to **Environment Variables** configuration in your project to set
environment variables. Remember to click **Update** after changing a value.

Coolify creates a `.env` file from the variables that is used during deployment
so basic `.env` file formatting principles apply with some additional
considerations.

You should check **Is Literal?** for each variable unless you specifically want
to use interpolation. Not using **Is Literal?** causes problems with certain
special characters (such as `$`) so it's best to check it for all variables
by default.

If your value contains special characters (e.g. `@`), you need to wrap the value
in quotes. (e.g. `admin@example.com` should be `"admin@example.com"`). Be wary
of values that may be interpreted as escape sequences (such as a value ending in
`\`).

You may optionally **Lock** any secrets you don't want to be editable in Coolify
UI. If you want to change a locked value, you need to delete it, navigate to
**General** and then back to **Environment Variables**. This reloads the deleted
environment variables from `docker-compose.yaml`.

> [!WARNING]
>
> Locked environment variables are only hidden in the Coolify UI. They are still
> stored in plain text on the host system in
> `/data/coolify/applications/<id>/.env` file owned by `root`.

## How to use build args with Docker Compose

If you want to define a build arg, just add it as an environment
variable in Coolfiy UI and use it in `docker-compose-yml`.

> [!IMPORTANT]
>
> Don't use **Build Variable?** for build args when using Docker Compose. They
> don't work.

```yml
# docker-compose.yml
services:
  app:
    build:
      dockerfile: Dockerfile
      args:
        - TEST_SECRET
```

By omitting the value of a build arg, Docker Compose automatically uses the
value defined in the `.env` file written by Coolify.
