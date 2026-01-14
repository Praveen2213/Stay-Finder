// function wrapAsync(fn){
//     return function(req, res, next){
//         fn(req, res, next).catch(next);
//     };
// };
//one more form for writing this

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};