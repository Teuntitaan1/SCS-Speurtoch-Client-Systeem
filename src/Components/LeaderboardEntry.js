import React from 'react';
import '../StyleSheets/App.css';

class LeaderboardEntry extends React.Component {
	
    constructor (props){
        super(props);
    }

    render() {
		return(
			<div className='LeaderboardEntryDiv'>
				<p>{this.props.Entry["TimeSpent"]}</p>
			</div>
		);
	}
} 

export default LeaderboardEntry;