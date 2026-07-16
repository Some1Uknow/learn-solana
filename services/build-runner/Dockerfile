FROM rust:1.95-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && printf 'fn main() {}' > src/main.rs && cargo build --release
COPY src ./src
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates libgcc-s1 libstdc++6 && rm -rf /var/lib/apt/lists/* \
  && useradd --system --uid 10001 runner && mkdir /tmp/runner && chown runner:runner /tmp/runner
COPY --from=build /app/target/release/learnsol-build-runner /usr/local/bin/learnsol-build-runner
USER 10001
ENV TMPDIR=/tmp/runner
EXPOSE 8080
CMD ["/usr/local/bin/learnsol-build-runner"]
