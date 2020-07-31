import React from 'react';
import TablePlus from './TablePlus.js';

module.exports = function ( context ) {
	const hooks = context.hooks;

	// When the database section of a site loads up, before the Sequel Pro and Adminer buttons...
	hooks.addContent( 'SiteInfoDatabase_TableList_TableListRow[Connect]:Before', ( site ) => {

		// Load our TablePlus.js Component.
		return (
			<TablePlus key="tableplus" site={site} />
		);
	} );
};
