const { User, Book } = require('../models');

const resolvers = {
  Query: {
    me: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('savedBooks');
    },
  }
}

module.exports = resolvers;