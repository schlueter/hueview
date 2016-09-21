default: sass js

.PHONY: default sass lint lint-sass lint-js edit clean js

lint: lint-sass lint-js

node_modules:
	npm install

sass: static/main.css

js:
	mkdir -p static
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
	mkdir -p static/fonts
	cp node_modules/font-awesome/fonts/*-webfont.* static/fonts

lint-js:
	jshint src/js

clean:
	rm -rf node_modules static

edit:
	find . -type f \
		-not \( \
		  -regex '.*\..*' \
		  -o -regex '.*node_modules.*' \
		  -o -regex '.*makefile.*' \
		\) \
		-exec vim {} +
