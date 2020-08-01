import React from 'react';
import TablePlus from './TablePlus.js';

module.exports = function (context) {
	const { hooks } = context;

	hooks.addContent('SiteInfoDatabase_TableList_TableListRow[Connect]:Before', (site) => (
		<TablePlus key="tableplus" site={site} context={context} />
	));
};
