default: | clean sass js index

.PHONY: default sass lint lint-sass lint-js edit clean js node_modules watch js-index sass-index index

SRC_DIR=src
SRC_INDEX=$(SRC_DIR)/index.html
SRC_JS=$(shell awk '/js-concat:/,/js-concat\ fi\ /{ if (!/(js-concat:|js-concat\ fi)/)print}' $(SRC_INDEX) | sed -n 's/.*src="\(.*\)".*/\1/p')
SRC_SASS=$(shell awk '/sass-build:/,/sass-build\ fi\ /{ if (!/(sass-build:|sass-build\ fi)/)print}' $(SRC_INDEX) | sed -n 's/.*href="\(.*\)".*/\1/p')

DEST_DIR=static
DEST_CSS=$(DEST_DIR)/app.css
DEST_CSS=$(DEST_DIR)/$(shell sed -n 's/.*sass-build:\ \([^ ]*\)\ -->*/\1/p' $(SRC_INDEX))
DEST_JS=$(DEST_DIR)/$(shell sed -n 's/.*js-concat:\ \([^ ]*\)\ -->*/\1/p' $(SRC_INDEX))
DEST_INDEX=index.html

lint: lint-sass lint-js
sass: $(DEST_CSS)
js: $(DEST_JS)
index: $(DEST_INDEX) | js-index sass-index

node_modules:
	npm install

$(DEST_JS):
	@mkdir -p static
	@echo ';(function () {' > $(DEST_JS); \
	echo '  "use strict";' >> $(DEST_JS); \
	for f in $(SRC_JS); \
	do \
		echo Adding contents of $(SRC_DIR)/$$f to $(DEST_JS);\
		echo ';(function () {' >> $(DEST_JS); \
		cat $(SRC_DIR)/$$f >> $(DEST_JS); \
		echo '})()' >> $(DEST_JS); \
	done; \
	echo '})()' >> $(DEST_JS)

js-index: $(DEST_INDEX)
	@echo Replacing js-concat section of index.html with load of $(DEST_JS)
	@sed -i '' '/js-concat:/,/js-concat\ fi/{//!d;}; /js-concat:/a\'$$' \
		\n''<script type="text/javascript" src="$(DEST_JS)"></script>'$$' \
		\n''; /js-concat/d' $(DEST_INDEX)

# Close ' for highlighters

sass-index: $(DEST_INDEX)
	@echo Replacing build-sass section of index.html with include of $(DEST_CSS)
	@sed -i '' '/sass-build:/,/sass-build\ fi/{//!d;}; /sass-build:/a\'$$' \
		\n''<link rel="stylesheet" type="text/css" href="$(DEST_CSS)">'$$' \
		\n''; /sass-build/d' $(DEST_INDEX)

# Close ' for highlighters

$(DEST_INDEX):
	@echo Copying $(SRC_INDEX) template to $(DEST_INDEX)
	@[ -f $(DEST_INDEX) ] || cp $(SRC_INDEX) $(DEST_INDEX)

$(DEST_CSS): $(DEST_DIR)/fonts
	@echo Building $(SRC_DIR)/$(SRC_SASS) into $(DEST_CSS)
	@sassc --style expanded \
		--line-comments \
		--sourcemap \
		--load-path node_modules/font-awesome/scss \
		$(SRC_DIR)/$(SRC_SASS) $(DEST_CSS)

lint-sass:
	sass --check $(SRC_DIR)/$(SRC_SASS)

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
