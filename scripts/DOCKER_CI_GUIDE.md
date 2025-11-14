# Docker CI/CD Quick Reference

## Overview
This project uses Docker to ensure 100% reproducibility between local development and CI environments. All CI/CD jobs run inside Docker containers with pre-installed dependencies.

---

## Quick Start

### Local Validation (Before Push)
```bash
# Windows
scripts\test-docker-ci.bat

# Linux/Mac
bash scripts/test-docker-ci.sh
```

### Manual Docker Commands

**Build Images:**
```bash
# Build validation image (type-check, lint, build)
docker build -t sigeco-ci:validate --target validate .

# Build test image (includes Cypress)
docker build -t sigeco-ci:test --target test .
```

**Run Validation:**
```bash
docker run --rm -e CI=true sigeco-ci:validate npm run validate
```

**Run Cypress Tests:**
```bash
# Interactive shell inside container
docker run --rm --network host -it sigeco-ci:test

# Inside container:
npm run dev &
sleep 10
npm run test:cypress:ci
```

**Verify Cypress:**
```bash
docker run --rm sigeco-ci:test npx cypress verify
docker run --rm sigeco-ci:test npx cypress info
```

---

## Files Structure

```
.
├── Dockerfile.ci              # Multi-stage Docker build for CI
├── .dockerignore              # Optimize Docker build context
├── .github/workflows/
│   ├── cypress.yml            # Cypress E2E tests (Docker-based)
│   └── pr-validation.yml      # Type-check, lint, build (Docker-based)
├── scripts/
│   ├── test-docker-ci.bat     # Windows validation script
│   ├── test-docker-ci.sh      # Linux/Mac validation script
│   └── DOCKER_CI_GUIDE.md     # This file
└── package.json               # Added: exceljs, wait-on
```

---

## GitHub Actions Workflow

Both workflows (`cypress.yml` and `pr-validation.yml`) follow this pattern:

1. **Checkout code** → `actions/checkout@v4`
2. **Setup Docker Buildx** → `docker/setup-buildx-action@v3`
3. **Build Docker image** → `docker/build-push-action@v5`
   - Uses GitHub Actions cache for speed
   - Target: `test` or `validate`
4. **Run tests/validation inside container** → `docker run`
5. **Upload artifacts** (screenshots, videos)

---

## Troubleshooting

### Build is slow
- **First build:** 5-10 minutes (downloads base images)
- **Subsequent builds:** 1-2 minutes (uses cache)

### Cypress tests fail
- **Environment issue (before):** Missing OS dependencies
- **Environment issue (after Docker):** ✅ Fixed!
- **Real test failure:** Check screenshots/videos in GitHub Actions artifacts

### Test locally with exact CI environment
```bash
docker run --rm -it sigeco-ci:test sh
# Now you're inside the exact CI environment
```

---

## CI/CD Benefits

✅ **Reproducibility:** Same environment everywhere (local, CI, any developer)  
✅ **Stability:** No more "works on my machine"  
✅ **Speed:** GitHub Actions cache makes builds fast  
✅ **Debugging:** Run exact CI environment locally  
✅ **Dependencies:** All Cypress OS deps pre-installed  

---

## Next Steps After Push

1. Monitor GitHub Actions: `https://github.com/<your-repo>/actions`
2. Check workflow run logs
3. Download artifacts (screenshots, videos) if tests fail
4. If failures persist, they're **real bugs** (not environment issues)

---

**Last Updated:** 2025-11-14  
**Docker Base Image:** `node:20-bookworm`  
**Cypress Version:** `15.6.0`
