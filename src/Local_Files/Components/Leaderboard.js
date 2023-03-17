import React from 'react';
import '../StyleSheets/App.css';

class Leaderboard extends React.Component {
    render() {
        return (
        <>
                <table border={1} cellPadding={5} style={{marginTop : 1+"rem", width  : 100+"%", borderCollapse : 'collapse', borderRadius : 1+"rem"}}>
                    <tbody>
                        <tr style={{textAlign : 'center'}}>
                            <th style={{backgroundColor : "#56a222", borderBottom : '1px solid #dddddd'}}>#</th>
                            <th style={{backgroundColor : "#56a222", borderBottom : '1px solid #dddddd'}}>Naam</th>
                            <th style={{backgroundColor : "#56a222", borderBottom : '1px solid #dddddd'}}>Punten</th>
                        </tr>
                        {/*This can be improved upon*/}
                        {this.props.Leaderboard.slice(0, 5).map((Entry, index) => {
                                if (this.props.Uuid === Entry.Uuid) {
                                    return (
                                        <tr style={{backgroundColor : "#457c1f"}} key={index}>
                                            <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{index + 1}</td>
                                            <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{Entry.UserName.length < 10 ? Entry.UserName : Entry.UserName.slice(0, 7) + "..."}</td>
                                            <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{Entry.TotalPoints}</td>
                                        </tr>
                                    );
                                }
                                return (
                                    <tr key={index}>
                                        <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{index + 1}</td>
                                        <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{Entry.UserName.length < 10 ? Entry.UserName : Entry.UserName.slice(0, 7) + "..."}</td>
                                        <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{Entry.TotalPoints}</td>
                                    </tr>
                                );})}
                        {/*The most confusing statement i have ever written thus far, checks if the user's entry is in the first 5 entries of the leaderboard*/}
                        {this.props.SendResults === true && this.props.Leaderboard.slice(0, 5).map((Entry) => {if(this.props.Uuid === Entry.Uuid) {return true;} return false;}).includes(true) !== true ?
                            <tr style={{backgroundColor : "#457c1f"}}>
                                <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{this.props.Leaderboard.map((Entry, index) => {if(this.props.Uuid === Entry.Uuid) {return index+1;}; return null;})}</td>
                                <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{this.props.Leaderboard.map((Entry) => {if(this.props.Uuid === Entry.Uuid) {return Entry.UserName.length < 10 ? Entry.UserName : Entry.UserName.slice(0, 7) + "...";}; return null;})}</td>
                                <td style={{textAlign : 'center', borderBottom : '1px solid #dddddd'}}>{this.props.Leaderboard.map((Entry) => {if(this.props.Uuid === Entry.Uuid) {return Entry.TotalPoints;}; return null;})}</td>
                            </tr>
                            : 
                            null}
                    </tbody>
            </table>
        </>);
    }
}
export default Leaderboard;