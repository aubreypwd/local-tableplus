/* eslint-disable */

import React from 'react';
import TablePlus from './TablePlus.js';

module.exports = function ( context ) {
	context.hooks.addContent( 'SiteInfoDatabase_TableList_TableListRow[Connect]:Before', ( site ) => (
		<TablePlus key="tableplus" site={site} />
	) );
};
