import React from 'react';
import { TextButton } from '@getflywheel/local-components';

export default class TablePlus extends React.Component {
	constructor( props ) {
		super( props );
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	connect () {

	}

	render () {
		return (
			<TextButton onClick={() => this.connect()}>TablePlus</TextButton>
		);
	}
};
