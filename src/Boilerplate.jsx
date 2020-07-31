import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

// https://getflywheel.github.io/local-addon-api/modules/_local_renderer_.html
import * as LocalRenderer from '@getflywheel/local/renderer';

// https://github.com/getflywheel/local-components
import { Button, FlyModal, Title, Text } from '@getflywheel/local-components';

export default class Boilerplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			siteId: props.match.params.siteID,
			count: this.fetchCount(),
			showInstructions: false,
		};

		this.hideInstructions = this.hideInstructions.bind(this);
		this.increaseCount = this.increaseCount.bind(this);
		this.decreaseCount = this.decreaseCount.bind(this);
		this.randomlySetCount = this.randomlySetCount.bind(this);
		this.saveCount = this.saveCount.bind(this);
	}

	componentDidMount() {
		ipcRenderer.once('instructions', (event) => {
			this.setState({
				showInstructions: true,
			});
		});
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners('instructions');
	}

	fetchCount() {
		const site = this.props.sites[this.props.match.params.siteID],
		return site.count ?? 0;
	}

	hideInstructions() {
		this.setState({
			showInstructions: false,
		});
	}

	saveCount() {
		ipcRenderer.send(
			'save-count',
			this.state.siteId,
			this.state.count,
		);
	}

	increaseCount() {
		const oldCount = this.state.count;
		this.setState({
			count: oldCount + 1,
		});
	}

	decreaseCount() {
		const oldCount = this.state.count;
		this.setState({
			count: oldCount - 1,
		});
	}

	async randomlySetCount() {
		const newCount = await LocalRenderer.ipcAsync('get-random-count');
		this.setState({
			count: newCount,
		});
	}

	renderCount() {
		return <p>Count: {this.state.count}</p>;
	}

	renderInstructions() {
		return (
			<FlyModal
				isOpen={this.state.showInstructions}
				onRequestClose={this.hideInstructions}
			>
				<Title fontSize='xl'>Boilerplate Add-on</Title>
				<div style={{padding: '20px'}}>
					<Text
						fontSize='l'
						privateOptions={{
							fontWeight: 'medium',
						}}
					>
						You just saved the count for this site! You can exit this add-on and return to find the count will remain the same (but only if you save!).
						This is a boilerplate add-on to help you get started with development.
						You will find a few examples in this add-on related to using Local Components, the Local add-on API, and other useful tools for making your add-on awesome!
						Visit <a href='https://localwp.com/get-involved'>the Local webpage about add-ons</a> for more information about making an add-on for Local.
						We can't wait to see what you create!
					</Text>
				</div>
			</FlyModal>
		)
	}

    render() {
        return (
            <div style={{ flex: '1', overflowY: 'auto', margin: '10px' }}>
                <h2>Hello, World!</h2>
				{this.renderInstructions()}
				{this.renderCount()}
				<div>
					<Button onClick={this.decreaseCount}>Decrement Count</Button> &nbsp;
					<Button onClick={this.increaseCount}>Increment Count</Button> &nbsp;
					<Button onClick={this.randomlySetCount}>Randomize Count</Button> &nbsp;
					<Button onClick={this.saveCount}>Save Count</Button>
				</div>
            </div>
        )
    }

}
