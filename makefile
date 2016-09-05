default: sass

.PHONY: default sass lint lint-sass lint-js edit

lint: lint-sass lint-js

sass: static/main.css

static/main.css: static/fonts src/sass/*.sass
	sassc --style expanded \
		--line-comments \
		--sourcemap \
		--load-path node_modules/font-awesome/scss \
		src/sass/main.sass static/main.css

lint-sass: src/sass/*.sass
	sass --check src/sass/main.sass

static/fonts: node_modules/font-awesome/fonts/*-webfont.*
	mkdir static/fonts
	cp node_modules/font-awesome/fonts/*-webfont.* static/fonts

lint-js: static/*.js
	jshint static

edit:
	find . -type f \
		-not -regex '.*\.git.*' \
		-not -regex '.*\.sassc' \
		-not -regex '.*\.css.*' \
		-not -regex '.*node_modules.*' \
		-not -regex '.*fonts.*' \
		-exec vim {} +
