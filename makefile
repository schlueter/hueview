default: | clean sass js

.PHONY: default sass lint lint-sass lint-js edit clean js node_modules watch

SRC_DIR='src'
SRC_INDEX='$(SRC_DIR)/index.html'

SRC_JS=$(shell awk '/concat:/,/\ fi\ /{ if (!/(concat:|fi)/)print}' $(SRC_INDEX) | sed -n 's/.*src="\(.*\)".*/\1/p')
DEST_JS=$(shell sed -n 's/.*concat:\ \([^ ]*\)\ -->*/\1/p' $(SRC_INDEX))
DEST_DIR='static'
DEST_INDEX='index.html'

lint: lint-sass lint-js
sass: $(DEST_DIR)/app.css
js: $(DEST_JS)

node_modules:
	npm install

$(DEST_JS): $(DEST_INDEX)
	@mkdir -p static
	echo '' > $(DEST_JS); \
	for f in $(SRC_JS); \
	do \
		echo $$f $(DEST_JS);\
		echo ';(function () {' >> $(DEST_JS); \
		cat $$f >> $(DEST_JS); \
		echo '})()' >> $(DEST_JS); \
	done

$(DEST_INDEX):
	sed '/concat:/,/\ fi\ /{//!d;}; /concat:/a\'$$'\n''<script type="text/javascript" src="$(DEST_JS)"></script>'$$'\n''; /concat/d ; /\ fi\ /d' $(SRC_INDEX) \
		> $(DEST_INDEX)

# Close ' for highlighters

static/js:
	@mkdir -p static
	cp src/js/* static/

$(DEST_DIR)/app.css: $(DEST_DIR)/fonts
	sassc --style expanded \
		--line-comments \
		--sourcemap \
		--load-path node_modules/font-awesome/scss \
		src/sass/main.sass static/app.css

lint-sass: src/sass/*.sass
	sass --check src/sass/main.sass

$(DEST_DIR)/fonts: node_modules
	@mkdir -p static/fonts
	cp node_modules/font-awesome/fonts/*-webfont.* static/fonts

lint-js:
	jshint src/js

clean:
	rm -rf node_modules static $(DEST_INDEX)

edit:
	find src -type f -exec vim {} +

watch:
	@if [ -f node_modules/wr/bin/wr ]; \
	then node_modules/wr/bin/wr 'make js sass' src; \
	else printf '\x1B[31mPlease run `make node_modules` and try again.\x1B[0m'; \
	fi
