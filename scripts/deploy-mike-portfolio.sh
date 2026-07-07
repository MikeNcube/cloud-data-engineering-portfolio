#!/usr/bin/env bash
# Deploy upgraded portfolio to MikeNcube/mike-portfolio (Vercel production).
# Run this on YOUR machine with YOUR GitHub credentials — not the Cursor agent.
set -euo pipefail

SOURCE_REPO="${SOURCE_REPO:-https://github.com/MikeNcube/cloud-data-engineering-portfolio.git}"
SOURCE_BRANCH="${SOURCE_BRANCH:-cursor/portfolio-world-class-6ca8}"
TARGET_REPO="${TARGET_REPO:-https://github.com/MikeNcube/mike-portfolio.git}"
TARGET_BRANCH="${TARGET_BRANCH:-cursor/portfolio-ai-engineer-upgrade-d29a}"

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo "==> Cloning source ($SOURCE_BRANCH)..."
git clone --depth 1 --branch "$SOURCE_BRANCH" "$SOURCE_REPO" "$WORKDIR/source"

echo "==> Cloning target ($TARGET_BRANCH)..."
git clone --branch "$TARGET_BRANCH" "$TARGET_REPO" "$WORKDIR/target"
cd "$WORKDIR/target"

echo "==> Syncing mike-portfolio/ contents..."
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -r "$WORKDIR/source/mike-portfolio/." .
rm -rf node_modules .next .env.local tsconfig.tsbuildinfo 2>/dev/null || true

echo "==> Verifying build..."
npm install
npx tsc --noEmit
npm run build

git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi

git commit -m "Ship evidence-based portfolio: live RAG, recruiter conversion, honest projects"
git push origin "$TARGET_BRANCH"

echo ""
echo "==> Done. Vercel should redeploy automatically."
echo "    Verify: https://mike-portfolio-tawny.vercel.app"
echo "    Expect hero: 'full-stack RAG & Python backends'"
echo ""
echo "    If site does not update within 2 minutes:"
echo "    1. Vercel Dashboard -> mike-portfolio -> Deployments -> Redeploy"
echo "    2. Confirm Production Branch = $TARGET_BRANCH"
echo "    3. Settings -> Environment Variables: GEMINI_API_KEY, RESEND_API_KEY"
