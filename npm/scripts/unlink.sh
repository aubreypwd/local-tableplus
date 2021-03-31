#!/bin/sh

function unlinkit {
	local pwd=$(pwd)
	local addondir="$HOME/Library/Application Support/Local/addons"
	local addonpath="$addondir/local-tableplus"

	if [ ! -d "$addondir" ]; then
		echo "⚠️  Cannot locate $addondir, is Local installed?"
		exit 0
	fi

	unlink "$addonpath"
	echo "⛓  Unlinked $addonpath"
}

unlinkit
