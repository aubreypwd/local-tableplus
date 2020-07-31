import React from 'react';
import { TextButton } from '@getflywheel/local-components';
import is from 'electron-is';

const { exec } = require( 'child_process' );
const fs = require( 'fs' );

export default class TablePlus extends React.Component {
	constructor( props ) {
		super( props );
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	getSockFile() {
		return `${this.props.site.paths.runData}/mysql/mysqld.sock`;
	}

	linkTmpMysqlSock( callback ) {
		fs.access( '/tmp/mysql.sock', fs.constants.F_OK, ( err ) => {
			if ( err ) {
				console.log( err );
			}

			fs.unlink( '/tmp/mysql.sock', ( err ) => {
				fs.symlinkSync( this.getSockFile(), '/tmp/mysql.sock', 'file', ( err ) => {
					console.log( err );
				} );
			} );

			callback();
		} );
	}

	connect() {
		this.linkTmpMysqlSock( () => {
			let uri = `mysql://${this.props.site.mysql.user}:${this.props.site.mysql.password}@localhost/${this.props.site.mysql.database}`;

			exec( `open "${uri}"`, ( err, stdout, stderr ) => {
				return;
			} );
		} );
	}

	getButtonLabel () {
		return 'Open TablePlus';
	}

	isMacOS() {
		return is.macOS();
	}

	hasTablePlus() {
		return fs.existsSync( '/Applications/TablePlus.app' );
	}

	canConnect() {
		return this.isMacOS() && this.hasTablePlus();
	}

	render() {
		if ( ! this.canConnect() ) {
			return (
				<TextButton disabled="disabled">{this.getButtonLabel()}</TextButton>
			);
		}

		return (
			<TextButton onClick={() => this.connect()}>{this.getButtonLabel()}</TextButton>
		);
	}
};
