default: build

.PHONY: default sass lint lint-sass lint-js edit clean js node_modules watch js-index sass-index index help

SRC_DIR=src
DEST_DIR=public

RELATIVE_STATIC=static
RELATIVE_CSS=$(RELATIVE_STATIC)/$(shell sed -n 's/.*sass-build:\ \([^ ]*\)\ -->*/\1/p' $(SRC_INDEX))
RELATIVE_JS=$(RELATIVE_STATIC)/$(shell sed -n 's/.*js-concat:\ \([^ ]*\)\ -->*/\1/p' $(SRC_INDEX))

DEST_INDEX=$(DEST_DIR)/index.html
DEST_STATIC=$(DEST_DIR)/$(RELATIVE_STATIC)
SRC_INDEX=$(SRC_DIR)/index.html
SRC_JS=$(shell awk '/js-concat:/,/js-concat\ fi\ /{ if (!/(js-concat:|js-concat\ fi)/)print}' $(SRC_INDEX) | sed -n 's/.*src="\(.*\)".*/\1/p')
SRC_SASS=$(shell awk '/sass-build:/,/sass-build\ fi\ /{ if (!/(sass-build:|sass-build\ fi)/)print}' $(SRC_INDEX) | sed -n 's/.*href="\(.*\)".*/\1/p')

DEST_CSS=$(DEST_DIR)/$(RELATIVE_CSS)
DEST_JS=$(DEST_DIR)/$(RELATIVE_JS)

NODE_MODULES=$(shell jq -r '.["dependencies"] * .["devDependencies"] | keys[] | "node_modules/" + .' package.json )

build: | clean index

lint: lint-sass lint-js
sass: $(DEST_CSS)
js: $(DEST_JS)
index: | js-index sass-index $(DEST_INDEX)
node_modules: $(NODE_MODULES)

help:           ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

clean:
	rm -rf node_modules public

edit:
	find src -type f -exec vim {} +

watch: node_modules
	node_modules/wr/bin/wr 'make js sass index' src

$(NODE_MODULES):
	npm install

$(DEST_JS):
	@mkdir -p $(DEST_STATIC)
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

js-index: | js $(DEST_INDEX)
	@echo Replacing js-concat section of index.html with load of $(RELATIVE_JS)
	@# Mixed whitespace here is intentional
	@sed -i '/js-concat:/,/js-concat\ fi/c\
    <script type="text/javascript" src="$(RELATIVE_JS)"></script>' \
		$(DEST_INDEX)

sass-index: | sass $(DEST_INDEX)
	@echo Replacing build-sass section of index.html with include of $(RELATIVE_CSS)
	@# Mixed whitespace here is intentional
	@sed -i '/sass-build:/,/sass-build\ fi/c\
    <link rel="stylesheet" type="text/css" href="$(RELATIVE_CSS)">' \
		$(DEST_INDEX)

$(DEST_INDEX):
	@echo Copying $(SRC_INDEX) template to $(DEST_INDEX)
	@[ -f $(DEST_INDEX) ] || cp $(SRC_INDEX) $(DEST_INDEX)

$(DEST_CSS): $(DEST_STATIC)/fonts
	@echo Building $(SRC_DIR)/$(SRC_SASS) into $(DEST_CSS)
	@pysassc --style expanded \
		--sourcemap \
		--include-path node_modules/font-awesome/scss \
		$(SRC_DIR)/$(SRC_SASS) $(DEST_CSS)

lint-sass:
	sass --check $(SRC_DIR)/$(SRC_SASS)

$(DEST_STATIC)/fonts: node_modules
	@mkdir -p $(DEST_STATIC)/fonts
	cp node_modules/font-awesome/fonts/*-webfont.* $(DEST_STATIC)/fonts

lint-js:
	jshint src/js
