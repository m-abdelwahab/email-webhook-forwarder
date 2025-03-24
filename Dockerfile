# Stage 1: Development dependencies
FROM oven/bun:1.0.30-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN bun install

# Stage 2: Production dependencies
FROM oven/bun:1.0.30-alpine AS production-dependencies-env
COPY bun.lockb package.json /app/
WORKDIR /app
RUN bun install --production

# Stage 3: Build
FROM oven/bun:1.0.30-alpine AS build-env
COPY . /app
COPY --from=development-dependencies-env /app/bun.lockb /app/bun.lockb
WORKDIR /app
RUN bun run build

# Stage 4: Final production image
FROM oven/bun:1.0.30-alpine
COPY bun.lockb package.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["bun", "run", "start"]
