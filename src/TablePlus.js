import React from 'react';

import { TextButton } from '@getflywheel/local-components';
import is from 'electron-is';

const { exec } = require( 'child_process' );
const fs = require( 'fs' );

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
	constructor( props ) {
		super( props );
	}

	/**
	 * Get the current site's .sock file.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {string} .Sock file in the Database dashboard.
	 */
	getSockFile() {
		return `${this.props.site.paths.runData}/mysql/mysqld.sock`;
	}

	/**
	 * Just something we can throw at callbacks when we want to do nothing.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 */
	doNothing() {
		// Silence is golden.
	}

	/**
	 * After a set amount of time remove the /tmp/mysql.sock file so it can be used for other connections.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @param  {number} time Milliseconds.
	 */
	relieveTmpSockFileAfter( time ) {
		setTimeout( () => fs.unlink( '/tmp/mysql.sock', () => this.doNothing() ), time );
	}

	/**
	 * Symlink the /tmp/mysql.sock file to the site sock file.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 */
	symlinkTmpSock() {
		fs.unlink( '/tmp/mysql.sock', ( err ) => {
			fs.symlinkSync( this.getSockFile(), '/tmp/mysql.sock', 'file', () => this.doNothing );
		} );
	}

	/**
	 * Connect to the .sock file then call callback.
	 *
	 * I had to get creative here, because TablePlus does not accept a socket
	 * via the mysql:// URI pattern, but it will connect to /tmp/mysql.sock by default
	 * if we supply localhost.
	 *
	 * This will remove that file, symlink it to the sites socket file, then open
	 * the mysql:// URI successfully opening TablePlus with the right socket connection.
	 *
	 * Once the symlink is made, it will call your callback.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @param  {Function} callback The callback to call when we prepare the .sock connection.
	 */
	connectToSocketThen( callback ) {
		fs.access( '/tmp/mysql.sock', fs.constants.F_OK, ( err ) => {
			this.symlinkTmpSock();
			callback();
		} );
	}

	/**
	 * Open TablePlus when you click the button.
	 *
	 * We use the `open` and a `mysql://` URI format to tell TablePlus to open our
	 * connection.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 */
	openTablePlus() {
		this.connectToSocketThen( () => {
			let uri = `mysql://${this.props.site.mysql.user}:${this.props.site.mysql.password}@localhost/${this.props.site.mysql.database}`;

			exec( `open "${uri}"`, () => this.relieveTmpSockFileAfter( 5000 ) );
		} );
	}

	/**
	 * The label for the button.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {string}
	 */
	getButtonLabel () {
		return 'Open TablePlus';
	}

	/**
	 * Only allow connections on MacOS TablePlus.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {boolean}
	 */
	isMacOS() {
		return is.macOS();
	}

	/**
	 * Detect TablePlus
	 *
	 * Assumes, like normal, you have it in /Applications/TablePlus.app.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {boolean}
	 */
	hasTablePlus() {
		return fs.existsSync( '/Applications/TablePlus.app' );
	}

	/**
	 * Test if we have the requirements to connect.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {boolean}
	 */
	canConnect() {
		return this.isMacOS() && this.hasTablePlus();
	}

	/**
	 * Render our [Open TablePlus] Button.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 */
	render() {
		if ( ! this.canConnect() ) {
			return (
				<TextButton disabled="disabled">{this.getButtonLabel()}</TextButton>
			);
		}

		return (
			<TextButton onClick={() => this.openTablePlus()}>{this.getButtonLabel()}</TextButton>
		);
	}
};
