const crypto = require('crypto');


export function hashPassword(password: string){
    const salt = crypto.randomBytes(16).toString("hex")

    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString('hex');

    return { hash, salt};
}

//candidatePS is the PS provied by user
//this is when a user in logging in.
export function verifyPassword({
    candidatePassword, 
    salt, 
    hash,
}:{
    candidatePassword: string;
    salt: string;
    hash: string;
}) {
    const candidatehash = crypto.pbkdf2Sync(
        candidatePassword, 
        salt, 
        1000, 
        64, 
        "sha512"
    ).toString('hex');

    return candidatehash === hash

}