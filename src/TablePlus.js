// import React from 'react';

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
		super( props ); // eleveate the props to this.
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
	 * Symlink a file to another.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @param  {string} to   Target file.
	 * @param  {string} from Source file.
	 */
	symlink( to, from ) {
		fs.symlinkSync( to, from, 'file', this.doNothing );
	}

	/**
	 * Unlink a file then run a callback.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @param  {string} file   File to unlink.
	 * @param  {Function} then Callback.
	 */
	unlinkThen( file, then ) {
		if ( fs.existsSync( file ) ) {
			fs.unlink( file, ( err ) => this.doNothing );
		}

		then();
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
		this.unlinkThen( '/tmp/mysql.sock', () => this.symlink( this.getSockFile(), '/tmp/mysql.sock' ) );
	}

	/**
	 * Symlink the /tmp/mysql.sock file and call back.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @param  {Function} callback The callback to run after.
	 */
	symlinkTmpSockThen( then ) {
		this.symlinkTmpSock();
		then();
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
	 * @param  {Function} then The callback to call when we prepare the .sock connection.
	 */
	connectToSocketThen( then ) {
		fs.access( '/tmp/mysql.sock', fs.constants.F_OK, ( err ) => this.symlinkTmpSockThen( then ) );
	}

	/**
	 * The mysql:// URI that Table Plus will open.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {string}
	 */
	getTablePlusURI() {
		return `mysql://${this.props.site.mysql.user}:${this.props.site.mysql.password}@localhost/${this.props.site.mysql.database}?enviroment=local&name=${this.props.site.name}&safeModeLevel=0&advancedSafeModeLevel=0`;
	}

	/**
	 * Open the mysql:// URI that Table Plus will open.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 */
	openURI() {
		exec( `open "${this.getTablePlusURI()}"`, () => this.relieveTmpSockFileAfter( 2000 ) );
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
		this.connectToSocketThen( () => this.openURI() );
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
