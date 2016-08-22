default: sass
.PHONY: default sass

sass : static/main.css

sassfiles = $(shell find src/sass -name  '*.sass')
static/main.css : $(sassfiles)
	sassc --style expanded --line-comments --sourcemap src/sass/main.sass static/main.css

