#!/bin/sh

function link {
	local pwd=$(pwd)
	local addondir="$HOME/Library/Application Support/Local/addons"
	local addonpath="$addondir/local-tableplus"

	if [ ! -d "$addondir" ]; then
		echo "⚠️  Cannot locate $addondir, is Local installed?"
		exit 0
	fi

	if [ -d "$addonpath" ]; then
		echo "🛑  $addonpath already exists, refusing to link.\n"
		exit 0
	fi

	ln -sf "$pwd" "$addonpath"

	echo "🔗  Linked to $addonpath"
	echo "⚙️  Building..."

	npm install --prefix "$addonpath"
	npm run build --prefix "$addonpath"

	echo "✅  Done, local-tableplus added to $addonpath"
}

link
