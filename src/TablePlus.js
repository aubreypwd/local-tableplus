import React from 'react';

import { TextButton } from '@getflywheel/local-components';
import is from 'electron-is';

const { exec } = require('child_process');
const fs = require('fs');

/* eslint-disable no-console */

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

		this.disabled = false;
		this.isRed = false;
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
		}, 250);
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
			disabled: !this.canConnect() || this.disabled,
		};

		this.setState(this.state);
		this.forceUpdate();
	}

	/**
	 * Get the current site's .sock file.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since 1.0.0
	 * @return {string} .Sock file in the Database dashboard.
	 */
	getLocalSockFile () {
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
	 * @return {boolean} True if we symlinked it properly.
	 */
	setupTmpSockFileForSite () {
		try {
			fs.unlinkSync(this.getTmpSockFile());
		} catch (err) {
			/*
			 * - The file is not unlinkable
			 * - The file isn't there
			 *
			 * Either way we don't care!
			 *
			 * Just continue on....
			 */
		}

		try {
			fs.symlinkSync(this.getLocalSockFile(),this.getTmpSockFile());
		} catch (err) {
			return false; // Couldn't symlink for ANY reason.
		}

		return true;
	}

	/**
	 * Console out an error
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.5.0
	 * @param  {mixed} what What to present.
	 * @return {void}
	 */
	error (what) {
		console.error(what);
	}

	/**
	 * Console out a warning
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.5.0
	 * @param  {mixed} what What to present.
	 * @return {void}
	 */
	warn (what) {
		console.warn(what);
	}

	/**
	 * Open TablePlus when you click the button.
	 *
	 * We use the `open` and a `mysql://` URI format to tell TablePlus to open our
	 * connection.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 *
	 * @since 1.0.0
	 * @since 1.0.5 Will show red on button if ultimately we couldn't do the right thing on click.
	 *
	 * @return {void}
	 */
	clickOpenTablePlus () {
		if (!this.setupTmpSockFileForSite()) {
			this.error(
				"Could not setup {$tmpFile} properly, so can't open TablePlus! We suspect we can't overwrite {$tmpFile}, try running: 'sudo rm /tmp/mysql.sock' and trying again."
					.replace('{$tmpFile}', this.getTmpSockFile())
			);

			this.flag(true); // Don't disable, but show an error because everything up until this point has said we can click the button.

			return;
		}

		this.openURI();
		this.flag(false); // This time no error, change the button back.
	}

	/**
	 * Disable the button.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.5
	 * @return {void}
	 */
	disable () {
		this.disabled = true;
	}

	/**
	 * Enable button.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.5
	 * @return {void}
	 */
	enable () {
		this.disabled = false;
	}

	/**
	 * Make the button red (flagging that there was a bigger error).
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.5
	 * @param  {boolean} on Set to true to make red, false to not.
	 * @return {void}
	 */
	flag (on) {
		this.isRed = on;
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
	 *
	 * @since  1.0.0
	 * @since  1.0.5 Shows red styles.
	 *
	 * @return {Object} Styles
	 */
	stateButtonStyles () {
		if (this.isRed) {
			return { ...this.defaultButtonStyles(), ...{ 'color': '#cc6565' } };// Red, something bad happened.
		}

		return this.canConnect() && !this.disabled
			? { ...this.defaultButtonStyles(), ...{ 'color': '#ffa600' } } // Yellow style.
			: this.defaultButtonStyles(); // Normal styles.
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
		return this.isMacOS()
			&& this.hasTablePlus()
			&& this.siteOn();
	}

	/**
	 * Does the /tmp/mysql.sock file exist?
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.4
	 * @return {boolean} True if it does.
	 */
	tmpSockFileExists () {
		return fs.existsSync(this.getTmpSockFile());
	}

	/**
	 * Get the /tmp/mysql.sock file that TablePlus can connect to by default.
	 *
	 * @author Aubrey Portwood <aubrey@webdevstudios.com>
	 * @since  1.0.3
	 * @return {string} Absolute file path.
	 */
	getTmpSockFile () {
		return '/tmp/mysql.sock';
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
				onClick={() => this.clickOpenTablePlus()}>{this.getButtonLabel()}</TextButton>
		);
	}
}
