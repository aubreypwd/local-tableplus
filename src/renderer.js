import React from 'react';
import TablePlus from './TablePlus.js';

console.log( 'loaded' );

module.exports = function ( context ) {
	const hooks = context.hooks;

	hooks.addContent( 'SiteInfoDatabase_TableList_TableListRow[Connect]:Before', ( site ) => {
		return (
			<TablePlus key="tableplus" props={...props} />
		);
	} );
};
