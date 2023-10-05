#!/bin/sh

if sh -c 'cd backend && yarn && tsc'; then :; else
	>&2 echo "Instalace backendu selhala."
	exit
fi

if sh -c 'cd frontend && yarn && yarn dev'; then :; else
	>&2 echo "Instalace frontendu selhala."
	exit
fi

sh -c 'cd backend && nsmt' &
sh -c 'cd frontend && yarn dev' &
