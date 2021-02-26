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
		super(props);

		this.addHooks();
		this.updateState();

		this.updateInterval();
	}

	/**
	 * Update Component on Interval.
	 *
	 * I know it's cheap, but the hooks aren't doing it, so
	 * this will force an update every 1 second.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {void} Nothing.
	 */
	updateInterval () {
		setInterval(() => {
			this.updateState();
			this.forceUpdate();
		}, 1000);
	}

	/**
	 * Hooks
	 *
	 * @TODO Why this no worky.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {Void} Nothing
	 */
	addHooks () {
		this.props.context.hooks.addAction('siteStarted', () => this.updateState());
		this.props.context.hooks.addAction('siteStopped', () => this.updateState());
	}

	/**
	 * Update the component state.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {Void} Nothing
	 */
	updateState () {
		this.state = {
			style: this.stateButtonStyles(),
			disabled: !this.siteOn(),
		};

		this.setState(this.state);
	}

	/**
	 * Get the current site's .sock file.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {string} .Sock file in the Database dashboard.
	 */
	getSockFile () {
		return `${this.props.context.environment.userDataPath}/run/${this.props.site.id}/mysql/mysqld.sock`;
	}

	/**
	 * Get the mysqld.sock.lock File.
	 *
	 * This file can be used to determine if a site is on or not.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {string} The supposed path to the mysqld.sock.lock file.
	 */
	getSockLockFile () {
		return `${this.props.context.environment.userDataPath}/run/${this.props.site.id}/mysql/mysqld.sock.lock`;
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
	 * Open the mysql:// URI that Table Plus will open.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 *
	 * @return {void}
	 */
	openURI () {
		exec(`open "${this.getTablePlusURI()}"`, () => this.doNothing());
	}

	/**
	 * Reset /tmp/mysql.lock then symlink the socket file.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.2
	 * @return {void}
	 */
	unlinkAndThenSymlinkTmpSockFile () {
		fs.unlink('/tmp/mysql.sock', () => this.symlinkTmpSockFile());
	}

	/**
	 * Symlink the /tmp/mysql.sock file to the site sock file.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {void}
	 */
	symlinkTmpSockFile () {
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
		this.unlinkAndThenSymlinkTmpSockFile();
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
	 * Is the site on, so we can connect to it.
	 *
	 * To figure this out a mysql.sock.lock file is created when on.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {void} Nothing.
	 *
	 * @TODO Need to figure out a way to detect if I can connect to the DB or not.
	 */
	siteOn () {
		return fs.existsSync(this.getSockLockFile());
	}

	/**
	 * What is the state of the button styles?
	 *
	 * Depending if the site is on or off, pass back different combinations
	 * of styles.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {Object} Styles
	 */
	stateButtonStyles () {
		return this.canConnect()
			? { ...this.defaultButtonStyles(), ...{	'color': '#ffa600' } }
			: this.defaultButtonStyles();
	}

	/**
	 * Button styles whether the site is on or off.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.0
	 * @return {Object} Styles
	 */
	defaultButtonStyles () {
		return {
			'padding-left': 0,
			'margin-right': 25,
		};
	}

	/**
	 * Test if we have the requirements to connect.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {boolean} Test response.
	 */
	canConnect () {
		return this.isMacOS() && this.hasTablePlus() && this.siteOn();
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
		return (
			<TextButton
				disabled={this.state.disabled}
				style={this.state.style}
				onClick={() => this.openTablePlus()}>{this.getButtonLabel()}</TextButton>
		);
	}
}
