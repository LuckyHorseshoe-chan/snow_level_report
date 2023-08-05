export PATH := ./node_modules/.bin/:$(PATH)

build: clean prepare
	tsc
	vite build

prepare: ./generated/api.ts

dev: prepare
	vite

preview: build
	vite preview

lint: src
	eslint "src/**/*.{ts,tsx}" --fix

format:
	prettier --write "src/**/*.{ts,tsx,css}"

clean:
	rm -rf dist/ dist-ssr/

./generated/api.ts: ./vendor/openapi.json
	orval
