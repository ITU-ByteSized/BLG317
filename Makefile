PYTHON ?= python3

.PHONY: run init-db seed db-setup

run:
	$(PYTHON) -m backend.main

init-db:
	$(PYTHON) -m backend.app.db.schema

seed:
	$(PYTHON) -m backend.app.db.seed

db-setup: init-db seed