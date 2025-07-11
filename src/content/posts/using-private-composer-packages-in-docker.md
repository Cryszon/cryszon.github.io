---
title: Using private Composer packages in Docker
datePublished: 2024-10-04
tags: ["docker", "php", "composer"]
---

1. [Create a new fine-grained GitHub
   PAT](https://github.com/settings/personal-access-tokens/new) with read-only
   access to **Contents** on repositories you want Composer to access.

2. Add GitHub PAT as JSON to your environment variables

```ini
# Replace `github_pat_xxx` with your token
COMPOSER_AUTH_JSON='{ "github-oauth": { "github.com": "github_pat_XXXX" } }'
```

3. Update `docker-compose.yaml` and `Dockerfile`

```yaml
# docker-compose.yaml
services:
  php:
    build:
      secrets:
        - COMPOSER_AUTH_JSON

secrets:
  COMPOSER_AUTH_JSON:
    environment: COMPOSER_AUTH_JSON
```

```dockerfile
# Dockerfile
RUN --mount=type=secret,id=composer_auth_json,dst=/app/auth.json \
    composer install --no-autoloader --no-ansi --no-dev --no-interaction --no-plugins --no-progress --no-scripts
```

> [!IMPORTANT]
>
> Using Coolify? Check out [this
> article](/posts/docker-build-secrets-in-coolify/) on how to use build secrets
> in Coolify.

## Additional information and references

- [Managing your personal access tokens - GitHub Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [Authentication for privately hosted packages and repositories - Composer](https://getcomposer.org/doc/articles/authentication-for-private-packages.md#authentication-using-the-composer-auth-environment-variable)
- [How to use secrets in Docker Compose | Docker Docs](https://docs.docker.com/compose/use-secrets/)
- [dunglas/docker-private-composer-packages: Example: Securely Access Private Composer Packages](https://github.com/dunglas/docker-private-composer-packages)
