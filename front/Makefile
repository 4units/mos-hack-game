.PHONY: deploy-front

SITE_ROOT := /var/www/4units.ru
DIST      := $(CURDIR)/dist

# Запуск на сервере
deploy-front:
	[ -d node_modules ] || npm i
	npm run build
	sudo rsync -av --delete --exclude='.well-known' $(DIST)/ $(SITE_ROOT)/
	sudo chown -R www-data:www-data $(SITE_ROOT)
	sudo find $(SITE_ROOT) -type d -exec chmod 755 {} \;
	sudo find $(SITE_ROOT) -type f -exec chmod 644 {} \;
	sudo nginx -t && sudo systemctl reload nginx