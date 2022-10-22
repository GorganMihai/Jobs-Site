import axios from "axios";
import { EventEmitter } from "fbemitter";

const SERVER = "http://localhost:8086";

class JobStore {
	constructor() {
		this.jobs = [];
		this.candidates = [];
		this.emitter = new EventEmitter();
	}

	async addJob(job) {
		try {
			await axios.post(`${SERVER}/jobs`, job);
			this.getJobs();
		} catch (error) {
			console.log(error);
			this.emitter.emit("ADD_JOBS_ERROR");
		}
	}

	async modJob(job, id) {
		try {
			await axios.put(`${SERVER}/jobs/${id}`, job);
			this.getJobs();
		} catch (error) {
			console.log(error);
			this.emitter.emit("MOD_JOBS_ERROR");
		}
	}

	async deleteJob(id) {
		try {
			await axios.delete(`${SERVER}/jobs/${id}`);
			this.getJobs();
		} catch (error) {
			console.log(error);
			this.emitter.emit("DELETE_JOBS_ERROR");
		}
	}

	async getJobs() {
		try {
			const response = await axios(`${SERVER}/jobs`);
			this.jobs = response.data;
			this.jobs.forEach((e) => {
				if (!e.logo) {
					e.logo = "logo192.png";
				}
			});
			this.emitter.emit("GET_JOBS_SUCCESS");
		} catch (error) {
			console.log(error);
			this.emitter.emit("GET_JOBS_ERROR");
		}
	}

	async sync() {
		try {
			const syncRes = await axios(`${SERVER}/sync`);
			console.log("Sync: " + syncRes.data.message);
			this.getJobs();
		} catch (error) {
			console.log(error);
			this.emitter.emit("SYNC_ERROR");
		}
	}
}

export default JobStore;
