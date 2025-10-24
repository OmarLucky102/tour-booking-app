class APIFeature {
  constructor(query, querStr) {
    this.query = query;
    this.queryStr = querStr;
  }
  //find Method
  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    //2)Advanced filters
    //Now can use Replace funcion on it
    let querStr = JSON.stringify(queryObj);
    querStr = querStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(querStr));
    return this;
  }
  sort() {
    //2) Sorting
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    //3) Field Limiting
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  Pagination() {
    //4) Pagination
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeature;
