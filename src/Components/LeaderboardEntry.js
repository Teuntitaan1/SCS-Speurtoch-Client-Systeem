import React from 'react';
import '../StyleSheets/App.css';

class LeaderboardEntry extends React.Component {

    render() {
		return(
			<div className='LeaderboardEntryDiv'>
				<p>{"{Naam}"} deed er {this.props.Entry["TimeSpent"]} seconden over</p>
			</div>
		);
	}
} 

export default LeaderboardEntry;