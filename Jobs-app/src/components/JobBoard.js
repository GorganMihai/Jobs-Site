import React from "react";
import Candidate from "./Candidate";
import CandidatesStore from "../stores/CandidatesStore";
import "../styles/jobBoard.css";
import "bootstrap/dist/css/bootstrap.min.css";

class JobBoard extends React.Component {
	constructor() {
		super();

		this.store = new CandidatesStore();

		this.state = {
			candidates: [],
			mode: 0,
			cardDim: 220,
			companyName: "",
			location: "",
			jobDescription: "",
			logo: "",
			logoAux: "",
			name: "",
			surname: "",
			email: "",
			phone: "",
			position: "",
			experience: "",
			avatar: "",
		};

		this.handleChange = (evt) => {
			this.setState({
				[evt.target.name]: evt.target.value,
			});
		};

		this.setDim = () => {
			this.setState({ cardDim: 220 + 80 * this.state.candidates.length });
		};

		this.changeMode = function (info) {
			if (info.mode === 0 && info.btn === 0) {
				this.setDim();
				this.setState({ mode: 2 });
			} else if (info.mode === 0 && info.btn === 1) {
				this.setState({ mode: 1 });
			} else if (info.mode === 0 && info.btn === 2) {
				this.setState({ mode: 3 });
			} else if (info.mode === 2 && info.btn === 0) {
				this.setState({ mode: 0 });
			} else if (info.mode === 1 && info.btn === 1) {
				this.setState({ mode: 0 });
			} else if (info.mode === 3 && info.btn === 2) {
				this.setState({ mode: 0 });
			}
		};

		this.GetDateFormat = function (date) {
			let year = date.split("-")[0];
			let month = date.split("-")[2];
			let day = date.split("-")[1];
			return month + "/" + day + "/" + year;
		};

		this.buildFileSelector0 = function () {
			const fileSelector = document.createElement("input");
			fileSelector.setAttribute("type", "file");
			fileSelector.setAttribute("multiple", "multiple");
			fileSelector.onchange = this.fileSelectorHandler0;
			return fileSelector;
		};

		this.buildFileSelector1 = function () {
			const fileSelector = document.createElement("input");
			fileSelector.setAttribute("type", "file");
			fileSelector.setAttribute("multiple", "multiple");
			fileSelector.onchange = this.fileSelectorHandler1;
			return fileSelector;
		};

		this.handleFileSelect = (m, e) => {
			e.preventDefault();

			if (m.mode === 0) {
				this.fileSelector0.click();
			} else {
				this.fileSelector1.click();
			}
		};

		this.fileSelectorHandler0 = (ev) => {
			ev.preventDefault();
			const files = ev.target.files;
			if (files.length >= 1) {
				const reader = new FileReader();
				reader.addEventListener("load", (ev) => {
					const URL = ev.target.result;
					let image = document.getElementById("addLogo");
					image.src = URL;
					this.setState({
						logoAux: URL,
					});
				});
				reader.readAsDataURL(files[0]);
			} else {
				console.log("read img(logo) file error");
			}
		};

		this.fileSelectorHandler1 = (ev) => {
			ev.preventDefault();
			const files = ev.target.files;
			if (files.length >= 1) {
				const reader = new FileReader();
				reader.addEventListener("load", (ev) => {
					const URL = ev.target.result;
					let image = document.getElementById("addPicture");
					image.src = URL;
					this.setState({
						avatar: URL,
					});
				});
				reader.readAsDataURL(files[0]);
			} else {
				console.log("read img(avatar) file error");
			}
		};

		this.btnDelete = () => {
			this.props.store.deleteJob(this.props.item.id);
		};

		this.btnOK = () => {
			const s = this.state;
			if (!s.companyName) {
				s.companyName = this.props.item.companyName;
			}
			if (!s.location) {
				s.location = this.props.item.location;
			}
			if (!s.jobDescription) {
				s.jobDescription = this.props.item.jobDescription;
			}
			if (!s.logoAux) {
				s.logoAux = this.props.item.logo;
			} else {
				this.setState({ logo: this.state.logoAux });
			}

			this.props.store.modJob(
				{
					companyName: this.state.companyName,
					location: this.state.location,
					jobDescription: this.state.jobDescription,
					logo: this.state.logoAux,
				},
				this.props.item.id
			);
			this.setState({ mode: 0 });
			this.props.store.getJobs();
		};

		this.addCandidate = () => {
			const s = this.state;
			this.store.addCandidate(this.props.item.id, {
				name: s.name,
				surname: s.surname,
				email: s.email,
				phone: s.phone,
				position: s.position,
				experience: s.experience,
				avatar: s.avatar,
			});

			this.setState({ mode: 0 });
		};
	}

	componentDidMount() {
		const { item } = this.props;
		const lg = JSON.parse(JSON.stringify(item.logo));
		this.setState({ logoAux: lg, logo: lg });
		this.fileSelector0 = this.buildFileSelector0();
		this.fileSelector1 = this.buildFileSelector1();

		this.store.emitter.addListener("GET_CAND_SUCCESS", () => {
			this.setState({ candidates: this.store.candidates });
		});

		this.store.getCandidates(this.props.item.id);
	}

	render() {
		const { item } = this.props;

		if (this.state.mode === 0) {
			return (
				<div class='card' id='card'>
					<div id='divLogo'>
						<img id='logo' src={this.state.logo} alt='Avatar' />
					</div>
					<div id='specs'>
						<h6 id='data'>{this.GetDateFormat(item.createdAt.split("T")[0])}</h6>
						<h5 id='jobDescriptio'>{item.jobDescription}</h5>
						<h6 id='numCompanie'>{item.companyName}</h6>
						<h6 id='locatie'>{item.location}</h6>
					</div>
					<div id='buttons'>
						<input
							id='btnView'
							className='btn btn-primary'
							type='button'
							value='View candidates'
							onClick={this.changeMode.bind(this, { mode: 0, btn: 0 })}></input>
						<input
							id='btnModify'
							className='btn btn-primary'
							type='button'
							value='Modify'
							onClick={this.changeMode.bind(this, { mode: 0, btn: 1 })}></input>
						<input
							id='btnApply'
							className='btn btn-primary'
							type='button'
							value='Apply'
							onClick={this.changeMode.bind(this, { mode: 0, btn: 2 })}></input>
					</div>
				</div>
			);
		} else if (this.state.mode === 1) {
			return (
				<div class='card' id='cardMod'>
					<div id='divLogo'>
						<img id='logo' src={this.state.logo} alt='Avatar' />
					</div>
					<div id='specs'>
						<h6 id='data'>{this.GetDateFormat(item.createdAt.split("T")[0])}</h6>
						<h5 id='jobDescriptio'>{item.jobDescription}</h5>
						<h6 id='numCompanie'>{item.companyName}</h6>
						<h6 id='locatie'>{item.location}</h6>
					</div>
					<div id='buttons'>
						<input
							id='btnView'
							className='btn btn-secondary'
							type='button'
							value='View candidates'></input>
						<input
							id='btnModify'
							className='btn btn-danger'
							type='button'
							value='Cancel'
							onClick={this.changeMode.bind(this, { mode: 1, btn: 1 })}></input>
						<input
							id='btnApply'
							className='btn btn-secondary'
							type='button'
							value='Apply'></input>
					</div>
					<div id='line'></div>
					<div id='modCard'>
						<label id='lbLogo' for='addLogo'>
							Company Logo
						</label>
						<img
							id='addLogo'
							src={this.state.logoAux}
							alt='Avatar'
							onClick={this.handleFileSelect.bind(this, { mode: 0 })}
						/>
						<input type='file' id='inputFile' style={{ display: "none" }} />
						<div id='form'>
							<label for='CompanyName'>Company Name:</label>
							<input
								id='CompanyName'
								name='companyName'
								class='form-control'
								onChange={this.handleChange}
								placeholder={item.companyName}></input>
							<label for='Location'>Location:</label>
							<input
								id='Location'
								name='location'
								class='form-control'
								placeholder={item.location}
								onChange={this.handleChange}
							/>
							<label for='jobDescription'>Job Description:</label>
							<textarea
								class='form-control'
								id='jobDescription'
								name='jobDescription'
								rows='3'
								placeholder={item.jobDescription}
								onChange={this.handleChange}></textarea>
						</div>
						<div id='divFinal'>
							<input
								type='button'
								id='btnOk'
								value='OK'
								class='btn btn-success'
								onClick={this.btnOK}></input>
							<input
								type='button'
								id='btnDeleteJobForm'
								value='Delete Job'
								class='btn btn-danger'
								onClick={this.btnDelete}></input>
						</div>
					</div>
				</div>
			);
		} else if (this.state.mode === 2) {
			return (
				<div
					class='card'
					id='candidatesCard'
					style={{ height: this.state.cardDim }}>
					<div id='divLogo'>
						<img id='logo' src={this.state.logo} alt='Avatar' />
					</div>
					<div id='specs'>
						<h6 id='data'>{this.GetDateFormat(item.createdAt.split("T")[0])}</h6>
						<h5 id='jobDescriptio'>{item.jobDescription}</h5>
						<h6 id='numCompanie'>{item.companyName}</h6>
						<h6 id='locatie'>{item.location}</h6>
					</div>
					<div id='buttons'>
						<input
							id='btnView'
							className='btn btn-danger'
							type='button'
							value='Hide'
							onClick={this.changeMode.bind(this, { mode: 2, btn: 0 })}></input>
						<input
							id='btnModify'
							className='btn btn-secondary'
							type='button'
							value='Modify'></input>
						<input
							id='btnApply'
							className='btn btn-secondary'
							type='button'
							value='Apply'></input>
					</div>
					<div id='candidatesLine'></div>
					<div id='candidatesList'>
						{this.state.candidates.map((e) => (
							<Candidate key={e.id} item={e} />
						))}
					</div>
				</div>
			);
		} else if (this.state.mode === 3) {
			return (
				<div class='card' id='applyCard'>
					<div id='divLogo'>
						<img id='logo' src={this.state.logo} alt='Avatar' />
					</div>
					<div id='specs'>
						<h6 id='data'>{this.GetDateFormat(item.createdAt.split("T")[0])}</h6>
						<h5 id='jobDescriptio'>{item.jobDescription}</h5>
						<h6 id='numCompanie'>{item.companyName}</h6>
						<h6 id='locatie'>{item.location}</h6>
					</div>
					<div id='buttons'>
						<input
							id='btnView'
							className='btn btn-secondary'
							type='button'
							value='View candidates'></input>
						<input
							id='btnModify'
							className='btn btn-secondary'
							type='button'
							value='Modify'></input>
						<input
							id='btnApply'
							className='btn btn-danger'
							type='button'
							value='Cancel'
							onClick={this.changeMode.bind(this, { mode: 3, btn: 2 })}></input>
					</div>
					<div id='line'></div>

					<img
						id='addPicture'
						src='avatar.jpg'
						alt='Avatar'
						onClick={this.handleFileSelect.bind(this, { mode: 1 })}
					/>
					<div id='applyForm'>
						<div>
							<label for='name'>First Name:</label>
							<input
								id='name'
								class='form-control is-invalid'
								name='name'
								onChange={this.handleChange}></input>
						</div>
						<div>
							<label for='surname'>Last Name:</label>
							<input
								id='surname'
								class='form-control'
								name='surname'
								onChange={this.handleChange}></input>
						</div>
						<div>
							<label for='email'>Email:</label>
							<input
								id='email'
								class='form-control '
								name='email'
								onChange={this.handleChange}></input>
						</div>
						<div>
							<label for='phoneNo'>Phone No:</label>
							<input
								id='phoneNo'
								class='form-control '
								name='phone'
								onChange={this.handleChange}></input>
						</div>
						<div>
							<label for='currentPosition'>Current position:</label>
							<input
								id='currentPosition'
								class='form-control '
								name='position'
								onChange={this.handleChange}></input>
						</div>
						<div>
							<label for='experience'>Experience:</label>
							<textarea
								id='experience'
								class='form-control '
								rows='3'
								name='experience'
								onChange={this.handleChange}></textarea>
						</div>
					</div>
					<div id='divFinalApply'>
						<input
							type='button'
							id='btnOk'
							value='Apply'
							class='btn btn-success'
							onClick={this.addCandidate}></input>
					</div>
				</div>
			);
		}
	}
}

export default JobBoard;
