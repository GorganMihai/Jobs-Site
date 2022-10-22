import React from "react";
import "../styles/candidate.css";

class Candidate extends React.Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		return (
			<div>
				<div class='card' id='canditate1'>
					<img id='candidatelogo' src={this.props.item.avatar} alt='Avatar' />
					<h5 id='n'>{this.props.item.name}</h5>
					<h5 id='s'>{this.props.item.surname}</h5>
					<h5 id='exp'>{this.props.item.experience}</h5>
				</div>
			</div>
		);
	}
}

export default Candidate;
