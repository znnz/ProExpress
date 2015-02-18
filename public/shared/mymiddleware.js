

module.exports=function(param){
    if(param==='A'){
        return function(req,res,next){
            console.log('mymiddleware is passing with param A');
            return next();
        }
    }else{
        return function(req,res,next){
            console.log('mymiddleware is passing withthout param ');
            return next();
        }
    }
}