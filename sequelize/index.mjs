import { Sequelize } from 'sequelize';
import fs from 'fs';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { Signer } from '@aws-sdk/rds-signer';
import User from './models/user.model.mjs';

const region = process.env.AWS_REGION || 'us-east-1';

const ssmClient = new SSMClient({ region });

// Get the parameter value from AWS Systems Manager Parameter Store
// Set WithDecryption to true if the parameter is a SecureString
// Remeber to use JSON.parse if the stored parameter is a JSON object
async function getParameterValue(parameterName, WithDecryption = false) {
  try {
    const command = new GetParameterCommand({
      Name: parameterName,
      WithDecryption
    });
    const response = await ssmClient.send(command);
    return response.Parameter.Value;
  } catch (err) {
    console.error('Error getting parameter:', err);
    throw err;
  }
}

// Get the auth token to connect to the database using IAM authentication
// The token is valid for 15 minutes
async function getAuthToken({ hostname, port, username }) {
  try {
    const signer = new Signer({ hostname, port, username });
    return await signer.getAuthToken();
  } catch (err) {
    console.error('Error getting auth token:', err);
    throw err;
  }
}

// function to initialize all models
export async function loadSequelize(parameterName, isLocal) {
  let sequelize;

  if (isLocal) {
    console.log('connect to local postgres');
    sequelize = new Sequelize('postgres', 'eric', null, {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      logging: false
    });
  } else {
    console.log('connect to rds postgres');
    const paramsValue = await getParameterValue(parameterName);
    const { endpoint, port, dbName, username } = JSON.parse(paramsValue);
    const token = await getAuthToken({ hostname: endpoint, port, username });

    const caBundle = fs.readFileSync('./us-east-1-bundle.pem');

    sequelize = new Sequelize(dbName, username, token, {
      dialect: 'postgres',
      host: endpoint,
      port,
      dialectOptions: {
        ssl: {
          ca: caBundle
        }
      },
      logging: false
    });
  }

  User(sequelize);

  return sequelize;
}
