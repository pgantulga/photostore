// import {
//   SecretsManagerClient,
//   GetSecretValueCommand,
// } from "@aws-sdk/client-secrets-manager";
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager')

const client = new SecretsManagerClient({ region: 'us-east-1' });

// async function getSecrets(secretName) {
//   const command = new GetSecretValueCommand({ SecretId: secretName });
//   const response = await client.send(command);
//   return JSON.parse(response.SecretString);
// }


const getSecrets = async (secretName) => {
    const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
    console.log("Secrets retrieved:", response);
    if (response.SecretString) {
        return response.SecretString;
    }

    if (response.SecretBinary) {
        return response.SecretBinary.toString('base64');
    }

}
const secretName = 'rdsdb-e3b4b6ac-0a71-495c-8d21-276c2e53bbe2';
getSecrets(secretName).then((data) => {
    console.log("Secret Data:", data);
}).catch((err) => {
    console.error("Error retrieving secrets:", err);
});


module.exports = getSecrets;




