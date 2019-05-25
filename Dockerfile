# Common base
FROM alpine:3.9.3 as build
USER root
WORKDIR /build
COPY . .
# Visit https://pkgs.alpinelinux.org/packages?name=nodejs to identify the
# version available. Different versions of the alpine image have different
# versions of nodejs available.
RUN apk add --update git make nodejs nodejs-npm jq sassc \
    && adduser -DSu 999 builder \
    && chown -R builder /build
USER builder
# See .dockerignore for what is excluded
RUN make

FROM nginx:alpine
COPY --chown=nobody --from=build /build/public ./public
COPY hueview-nginx.conf /etc/nginx/conf.d/hueview.conf
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80/tcp
CMD ["nginx", "-g", "daemon off;"]
