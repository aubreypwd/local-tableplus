import React from 'react';
import { TextButton } from '@getflywheel/local-components';

export default class TablePlus extends React.Component {
	constructor( props ) {
		super( props );
		console.log( props );
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	render () {
		return (
			<TextButton>TablePlus</TextButton>
		);
	}
};
