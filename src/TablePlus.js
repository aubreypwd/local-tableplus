import React from 'react';
import { TextButton } from '@getflywheel/local-components';
import is from 'electron-is';

const fs = require( 'fs' );

export default class TablePlus extends React.Component {
	constructor( props ) {
		super( props );
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	connect() {
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
