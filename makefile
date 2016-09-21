default: | clean sass js

.PHONY: default sass lint lint-sass lint-js edit clean js node_modules watch

lint: lint-sass lint-js

node_modules:
	npm install

sass: static/main.css

js:
	@mkdir -p static
	cp src/js/* static/

static/main.css: static/fonts src/sass/*.sass
	sassc --style expanded \
		--line-comments \
		--sourcemap \
		--load-path node_modules/font-awesome/scss \
		src/sass/main.sass static/main.css

lint-sass: src/sass/*.sass
	sass --check src/sass/main.sass

static/fonts: node_modules
	@mkdir -p static/fonts
	cp node_modules/font-awesome/fonts/*-webfont.* static/fonts

lint-js:
	jshint src/js

clean:
	rm -rf node_modules static

edit:
	find src -type f -exec vim {} +

watch:
	@if [ -f node_modules/wr/bin/wr ]; \
	then node_modules/wr/bin/wr 'make js sass' src; \
	else printf '\x1B[31mPlease run `make node_modules` and try again.\x1B[0m'; \
fi
