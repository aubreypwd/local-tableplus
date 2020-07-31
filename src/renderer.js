import React from 'react';
import TablePlus from './TablePlus.js';

module.exports = function ( context ) {
	const hooks = context.hooks;

	hooks.addContent( 'SiteInfoDatabase_TableList_TableListRow[Connect]:Before', ( site ) => {
		return (
			<TablePlus key="tableplus" site={site} />
		);
	} );
};
