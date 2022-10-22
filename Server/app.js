const express = require("express");
const Sequelize = require("sequelize");
const cors = require("cors");
const sequelize = new Sequelize("jobs_db", "root", "maria01", {
	dialect: "mariadb",
});

const Job = sequelize.define("job", {
	companyName: Sequelize.STRING,
	location: Sequelize.STRING,
	jobDescription: Sequelize.STRING,
	logo: Sequelize.TEXT,
});

const Candidate = sequelize.define("candidate", {
	name: Sequelize.STRING,
	surname: Sequelize.STRING,
	email: Sequelize.STRING,
	phone: Sequelize.STRING,
	position: Sequelize.STRING,
	experience: Sequelize.STRING,
	avatar: Sequelize.TEXT,
});

Job.hasMany(Candidate);

const app = express();
app.use(cors());
app.use(express.json());

//Sincronizare BD
app.get("/sync", async (req, res) => {
	try {
		await sequelize.sync({ force: true });
		res.status(201).json({ message: "Table created" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Sync error" });
	}
});

//Returneaza toate joburile
app.get("/jobs", async (req, res) => {
	try {
		const jobs = await Job.findAll({});
		res.status(200).json(jobs);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "error" });
	}
});

//Adaugare job
app.post("/jobs", async (req, res) => {
	try {
		await Job.create(req.body);
		res.status(201).json({ message: "created" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "error" });
	}
});

//Modificare job
app.put("/jobs/:jid", async (req, res) => {
	try {
		const job = await Job.findByPk(req.params.jid);
		if (job) {
			job.companyName = req.body.companyName;
			job.location = req.body.location;
			job.jobDescription = req.body.jobDescription;
			job.logo = req.body.logo;
			await job.save();
			res.status(202).json({ message: "accepted" });
		} else {
			res.status(404).json({ message: "cannot find book" });
		}
	} catch (error) {
		console.warn(error);
		res.status(500).json({ message: "The hamsters are in trouble" });
	}
});

// Stergere job
app.delete("/jobs/:jid", async (req, res) => {
	try {
		const jobs = await Job.findByPk(req.params.jid);
		if (jobs) {
			await jobs.destroy();
			res.status(201).json({ message: "Deleted" });
		} else {
			res.status(404).json({ message: "Cannot find the element" });
		}
	} catch (error) {
		console.error();
		res.status(500).json({ message: "The hamsters are in trouble" });
	}
});

// Candidates:

app.get("/jobs/:jid/candidates", async (req, res) => {
	try {
		const job = await Job.findByPk(req.params.jid);
		if (job) {
			const candidates = await job.getCandidates({ id: req.params.cId }); // ??????????
			res.status(200).json(candidates);
		} else {
			res.status(404).json({ message: "Cannot find job" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "The hamsters are in trouble" });
	}
});

app.post("/jobs/:jid/candidates", async (req, res) => {
	try {
		const job = await Job.findByPk(req.params.jid);
		if (job) {
			const candidate = new Candidate(req.body);
			candidate.jobId = job.id;
			await candidate.save();
			res.status(200).json({ message: "Candidate accepted" });
		} else {
			res.status(404).json({ message: "Cannot find job" });
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "The hamsters are in trouble (get book/id)" });
	}
});

app.listen(8086);
console.log("SERVER STARTED...");
