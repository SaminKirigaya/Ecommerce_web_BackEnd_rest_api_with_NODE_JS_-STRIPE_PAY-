
function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPassword = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomPassword += charset[randomIndex];
    }
  
    return randomPassword;
  }

async function GenPass (req, res){
    const genPass = generateRandomPassword(10);
    if(genPass){
        return res.status(200).json({
            message : 'Success',
            pass : genPass
        })
    }
}

module.exports = GenPass;