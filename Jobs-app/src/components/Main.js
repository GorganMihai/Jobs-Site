import React from "react";
import JobStore from "../stores/JobStore";
import JobBoard from "./JobBoard";
import "../styles/main.css";
import "bootstrap/dist/css/bootstrap.min.css";

class Main extends React.Component {
	constructor() {
		super();

		this.store = new JobStore();

		this.state = {
			Jobs: [],
			addJob: false,
			companyName: "",
			location: "",
			jobDescription: "",
			logo: "",
		};

		this.handleChange = (evt) => {
			this.setState({
				[evt.target.name]: evt.target.value,
			});
		};

		this.addJob = () => {
			this.store.addJob({
				companyName: this.state.companyName,
				location: this.state.location,
				jobDescription: this.state.jobDescription,
				logo: this.state.logo,
			});
			this.changeJobMode();
		};

		this.sync = () => {
			this.store.sync();
		};

		this.changeJobMode = () => {
			if (this.state.addJob === false) {
				this.setState({ addJob: true });
			} else {
				this.setState({ addJob: false });
			}
		};

		this.buildFileSelector = function () {
			const fileSelector = document.createElement("input");
			fileSelector.setAttribute("type", "file");
			fileSelector.setAttribute("multiple", "multiple");
			fileSelector.onchange = this.fileSelectorHandler;
			return fileSelector;
		};

		this.handleFileSelect = (e) => {
			e.preventDefault();
			this.fileSelector.click();
		};

		this.fileSelectorHandler = (ev) => {
			ev.preventDefault();
			const files = ev.target.files;
			if (files.length >= 1) {
				const reader = new FileReader();
				reader.addEventListener("load", (ev) => {
					const URL = ev.target.result;
					let image = document.getElementById("addLogo");
					image.src = URL;
					this.setState({
						logo: URL,
					});
				});
				reader.readAsDataURL(files[0]);
			} else {
				console.log("read img(logo) file error");
			}
		};
	}

	componentDidMount() {
		this.store.emitter.addListener("GET_JOBS_SUCCESS", () => {
			this.setState({ Jobs: this.store.jobs });
		});

		this.store.getJobs();

		this.fileSelector = this.buildFileSelector();
	}

	render() {
		if (this.state.addJob === false) {
			return (
				<div className='prymary' id='body'>
					<div id='topBar'>
						<img id='logoJobs' src='logo.png' alt='free' />
						<div id='btnsTop'>
							<input
								type='button'
								value='Sync'
								id='btnSync'
								class='btn btn-secondary'
								onClick={this.sync}
							/>
							<input
								type='button'
								value='Add Job'
								id='btnAddJob'
								class='btn btn-primary'
								onClick={this.changeJobMode}></input>
						</div>
					</div>
					{this.state.Jobs.map((e) => (
						<JobBoard key={e.id} item={e} store={this.store} />
					))}
				</div>
			);
		} else {
			return (
				<div className='prymary' id='body'>
					<div id='topBar'>
						<img id='logoJobs' src='logo.png' alt='free' />
						<div id='btnsTop'>
							<input
								type='button'
								value='Sync'
								id='btnSync'
								class='btn btn-secondary'
								onClick={this.sync}
							/>
							<input
								type='button'
								value='Cancel'
								id='btnAddJob'
								class='btn btn-danger'
								onClick={this.changeJobMode}></input>
						</div>
					</div>
					<div class='card' id='addCard'>
						<label id='lbLogo' for='addLogo'>
							Company Logo
						</label>
						<img
							id='addLogo'
							src='addImg.png'
							alt='Avatar'
							onClick={this.handleFileSelect}
						/>
						<div id='form'>
							<label for='CompanyName'>Company Name:</label>
							<input
								id='CompanyName'
								onChange={this.handleChange}
								name='companyName'
								class='form-control is-invalid'></input>
							<label for='Location'>Location:</label>
							<input
								id='Location'
								onChange={this.handleChange}
								name='location'
								class='form-control '></input>
							<label for='jobDescription'>Job Description:</label>
							<textarea
								class='form-control'
								id='jobDescription'
								onChange={this.handleChange}
								name='jobDescription'
								rows='3'></textarea>
						</div>
						<div id='divFinal'>
							<input
								type='button'
								id='btnAddJobForm'
								value='Add'
								class='btn btn-success'
								onClick={this.addJob}></input>
						</div>
					</div>

					<div>
						{this.state.Jobs.map((e) => (
							<JobBoard key={e.id} item={e} store={this.store} />
						))}
					</div>
				</div>
			);
		}
	}
}

export default Main;
