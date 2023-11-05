#!/bin/sh

if [ -z "${PROJECT_PATH}" ]; then
	PROJECT_PATH="/srv/IIS"
fi

if [ -z "${PROJECT_GIT}" ]; then
	PROJECT_GIT="https://github.com/prokopschield/IIS.git"
fi

PROJECT_PATH="${PROJECT_PATH%/}"
PARENT_PATH="${PROJECT_PATH%/*}"

fail() {
	echo "$1" >&2
	exit 1
}

if [ -d "${PROJECT_PATH}" ]; then :; else
	if [ -d "${PARENT_PATH}" ]; then :; else
		if mkdir -p "${PARENT_PATH}"; then :; else
			fail "Vytvoření ${PARENT_PATH} selhalo."
		fi
	fi

	if cd "${PARENT_PATH}"; then :; else
		fail "Nelze přejít do adresáře ${PARENT_PATH}."
	fi

	if git clone "${PROJECT_GIT}" "${PROJECT_PATH}"; then :; else
		fail "Nelze stáhnout ${PROJECT_GIT}."
	fi
fi

if cd "${PROJECT_PATH}"; then :; else
	fail "Nelze přejít do adresáře ${PROJECT_PATH}."
fi

if git pull; then :; else
	fail "Stažení dat z gitu selhalo"
fi

if docker compose down; then :; else
	fail "Vypnutí kontejnerů selhalo"
fi

if sh -c 'cd backend && yarn && tsc'; then :; else
	fail "Instalace backendu selhala."
fi

if sh -c 'cd frontend && yarn && yarn build'; then :; else
	fail "Instalace frontendu selhala."
fi

if docker compose up --build $*; then :; else
	fail "Zapnutí kontejnerů selhalo"
fi

echo "Projekt byl úspěšně spuštěn."
