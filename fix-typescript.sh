#!/bin/bash

# Fix unused variables by prefixing with underscore
sed -i '' 's/export async function GET(request: NextRequest/export async function GET(_request: NextRequest/g' app/api/cms/articles/[id]/route.ts
sed -i '' 's/export async function GET(request: NextRequest/export async function GET(_request: NextRequest/g' app/api/cms/status/route.ts
sed -i '' 's/export async function GET(request: Request/export async function GET(_request: Request/g' app/api/health/route.ts
sed -i '' 's/export async function GET(request: Request/export async function GET(_request: Request/g' app/api/metrics/route.ts
sed -i '' 's/export async function GET(request: NextRequest/export async function GET(_request: NextRequest/g' app/api/test-db/route.ts

echo "Fixed unused variables"
