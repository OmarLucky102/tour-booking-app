module.exports = (fn) => {
  return (req, res, next) => {
    //catch the error from the create tour here
    fn(req, res, next).catch(next);
  };
};