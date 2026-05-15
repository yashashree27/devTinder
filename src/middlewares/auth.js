const adminAuth = (req,res, next)=> {
    console.log("admin auth is getting checked");
    const token = 'xyz';
    const isAuthorized = token ==='xyz';
    if(!isAuthorized){
        res.status(401).send('unauthorized');
    }else {
        next();
    }
}


const authUser = (req, res, next) => {
 console.log("checking authentication for user");
 const token = "sdff";
 const isAuthorized = token ==='sdff';
 if(!isAuthorized){
    res.status(401).send('unauthorized');
 } else{
    next();
 }
}

module.exports = { adminAuth, authUser};