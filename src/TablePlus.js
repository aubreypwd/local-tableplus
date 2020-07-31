import React from 'react';
import { TextButton } from '@getflywheel/local-components';

import is from 'electron-is';

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

	isMacOs() {
		return is.macOS();
	}

	hasTablePlus() {
		return false;
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
