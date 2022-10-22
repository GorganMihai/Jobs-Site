import axios from "axios";
import { EventEmitter } from "fbemitter";

const SERVER = "http://localhost:8086";

class CandidatesStore {
	constructor() {
		this.candidates = [];
		this.emitter = new EventEmitter();
	}

	async addCandidate(jobID, candidate) {
		try {
			await axios.post(`${SERVER}/jobs/${jobID}/candidates`, candidate);
			this.getCandidates(jobID);
		} catch (error) {
			this.emitter.emit("ADD_CAND_ERROR");
		}
	}

	async getCandidates(jobID) {
		try {
			const response = await axios(`${SERVER}/jobs/${jobID}/candidates`);
			this.candidates = response.data;
			this.emitter.emit("GET_CAND_SUCCESS");
		} catch (error) {
			console.error(error);
			this.emitter.emit("GET_CAND_ERROR");
		}
	}
}

export default CandidatesStore;
