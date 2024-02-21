import { MONGODB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const uri = MONGODB_URI;

const client = new MongoClient(uri);
const clientPromise = client.connect();

export default clientPromise;
