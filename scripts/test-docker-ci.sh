#!/bin/bash

# ==============================================================================
# Docker CI/CD Local Test Script
# ==============================================================================
# This script validates the Docker-based CI/CD setup locally before pushing
# to GitHub. It mirrors the exact steps that run in GitHub Actions.
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}==>${NC} ${1}"
}

print_success() {
    echo -e "${GREEN}✓${NC} ${1}"
}

print_error() {
    echo -e "${RED}✗${NC} ${1}"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} ${1}"
}

# ==============================================================================
# Step 1: Validate Docker Setup
# ==============================================================================
print_step "Validating Docker installation..."

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker Desktop."
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi

print_success "Docker is installed and running"

# ==============================================================================
# Step 2: Build Docker Image (Validation Target)
# ==============================================================================
print_step "Building Docker image (validation target)..."

if docker build -t sigeco-ci:validate --target validate .; then
    print_success "Validation image built successfully"
else
    print_error "Failed to build validation image"
    exit 1
fi

# ==============================================================================
# Step 3: Build Docker Image (Test Target)
# ==============================================================================
print_step "Building Docker image (test target)..."

if docker build -t sigeco-ci:test --target test .; then
    print_success "Test image built successfully"
else
    print_error "Failed to build test image"
    exit 1
fi

# ==============================================================================
# Step 4: Run Validation (Type Check, Lint, Build)
# ==============================================================================
print_step "Running validation inside Docker container..."

if docker run --rm \
    -e CI=true \
    sigeco-ci:validate \
    npm run validate; then
    print_success "Validation passed (type-check, lint, build)"
else
    print_error "Validation failed"
    exit 1
fi

# ==============================================================================
# Step 5: Verify Cypress Installation
# ==============================================================================
print_step "Verifying Cypress binary inside container..."

if docker run --rm sigeco-ci:test npx cypress verify; then
    print_success "Cypress binary verified successfully"
else
    print_error "Cypress binary verification failed"
    exit 1
fi

# ==============================================================================
# Step 6: Check Cypress Info
# ==============================================================================
print_step "Checking Cypress info..."

docker run --rm sigeco-ci:test npx cypress info || true

# ==============================================================================
# Step 7: Optional - Run Cypress Tests (Requires Dev Server)
# ==============================================================================
print_warning "Cypress E2E tests require a running dev server."
echo -e "To run Cypress tests locally inside Docker:"
echo -e "  ${BLUE}docker run --rm --network host -it sigeco-ci:test${NC}"
echo -e "  ${BLUE}# Inside container: npm run dev & sleep 10 && npm run test:cypress:ci${NC}"
echo ""

# ==============================================================================
# Summary
# ==============================================================================
echo ""
print_success "=========================================="
print_success "Docker CI/CD Setup Validation Complete!"
print_success "=========================================="
echo ""
echo "Your Docker-based CI environment is ready. Key points:"
echo ""
echo "✅ Docker image builds successfully"
echo "✅ Validation pipeline works (type-check, lint, build)"
echo "✅ Cypress binary is installed and verified"
echo ""
echo "Next steps:"
echo "  1. Push changes to GitHub: git push"
echo "  2. Monitor GitHub Actions workflows"
echo "  3. Check for any real test failures (not environment issues)"
echo ""
print_success "Happy coding! 🚀"
