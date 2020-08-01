import React from 'react';

import { TextButton } from '@getflywheel/local-components';
import is from 'electron-is';

const { exec } = require('child_process');
const fs = require('fs');

/**
 * Table Plus Compoment
 *
 * @since 1.0.0
 * @author Aubrey Portwood <aubrey@webdevstudios.com>
 *
 * @see	rendereer.js Where this is loaded.
 */
export default class TablePlus extends React.Component {

	/**
	 * Constructor.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @param  {Object} props The properties from the <TablePlus> component from renderer.js.
	 */
	constructor (props) {
		super(props); // eleveate the props to this.
	}

	/**
	 * Get the current site's .sock file.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {string} .Sock file in the Database dashboard.
	 */
	getSockFile () {
		return `${this.props.site.paths.runData}/mysql/mysqld.sock`;
	}

	/**
	 * Just something we can throw at callbacks when we want to do nothing.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 *
	 * @return {void}
	 */
	doNothing () {
		// Silence is golden.
	}

	/**
	 * The mysql:// URI that Table Plus will open.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {string} mysql:// URI.
	 */
	getTablePlusURI () {
		return `mysql://${this.props.site.mysql.user}:${this.props.site.mysql.password}@localhost/${this.props.site.mysql.database}?enviroment=local&name=${this.props.site.name}&safeModeLevel=0&advancedSafeModeLevel=0`;
	}

	/**
	 * After a set amount of time remove the /tmp/mysql.sock file so it can be used for other connections.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @param  {number} time Milliseconds.
	 *
	 * @return {void}
	 */
	relieveSockFile (time) {
		setTimeout(() => fs.unlink('/tmp/mysql.sock', () => this.doNothing()), time);
	}

	/**
	 * Open the mysql:// URI that Table Plus will open.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 *
	 * @return {void}
	 */
	openURI () {
		exec(`open "${this.getTablePlusURI()}"`, () => this.relieveSockFile(2000));
	}

	/**
	 * Symlink the /tmp/mysql.sock file to the site sock file.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {void}
	 */
	symlinkSockFile () {
		fs.unlink('/tmp/mysql.sock', () => this.doNothing());
		fs.symlinkSync(this.getSockFile(), '/tmp/mysql.sock', 'file', this.doNothing);
	}

	/**
	 * Open TablePlus when you click the button.
	 *
	 * We use the `open` and a `mysql://` URI format to tell TablePlus to open our
	 * connection.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {void}
	 */
	openTablePlus () {
		this.symlinkSockFile();
		this.openURI();
	}

	/**
	 * The label for the button.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {string} Test response.
	 */
	getButtonLabel () {
		return 'Open TablePlus';
	}

	/**
	 * Only allow connections on MacOS TablePlus.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {boolean} Test response.
	 */
	isMacOS () {
		return is.macOS();
	}

	/**
	 * Detect TablePlus
	 *
	 * Assumes, like normal, you have it in /Applications/TablePlus.app.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {boolean} Test response.
	 */
	hasTablePlus () {
		return fs.existsSync('/Applications/TablePlus.app');
	}

	/**
	 * Test if we have the requirements to connect.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {boolean} Test response.
	 */
	canConnect () {
		return this.isMacOS()
			&& this.hasTablePlus();
	}

	/**
	 * Button Styles
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {Object} React Styles
	 */
	buttonStyles () {
		return {
			'padding-left': 0,
			'margin-right': 25,
			'color': '#ffa600',
		};
	}

	/**
	 * Render our [Open TablePlus] Button.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 *
	 * @return {Object} Component.
	 */
	render () {
		if (!this.canConnect()) {
			return (
				<TextButton
					style={this.buttonStyles()}
					disabled="true">{this.getButtonLabel()}</TextButton>
			);
		}

		return (
			<TextButton
				style={this.buttonStyles()}
				onClick={() => this.openTablePlus()}>{this.getButtonLabel()}</TextButton>
		);
	}
}
