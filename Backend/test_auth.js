import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import projectModel from './src/models/project.model.js';
import userModel from './src/models/user.model.js';

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Fetch any project
    const project = await projectModel.findOne();
    if (!project) {
        console.log("No projects found in DB");
        mongoose.connection.close();
        return;
    }

    console.log("Found Project:", project.name, "ID:", project._id);
    console.log("Project Users:", project.users);

    if (project.users && project.users.length > 0) {
        const userId = project.users[0];
        console.log("Checking user ID:", userId);
        const user = await userModel.findById(userId);
        if (user) {
            console.log("Found User:", user.email, "ID:", user._id);
            const isMember = project.users.some(uid => uid.toString() === user._id.toString());
            console.log("Is Member Comparison (uid.toString() === user._id.toString()):", isMember);
        } else {
            console.log("User not found for ID:", userId);
        }
    }

    mongoose.connection.close();
}

run().catch(console.error);
