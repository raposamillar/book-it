const { AuthenticationError } = require('apollo-server-express');
// const { default: SavedBooks } = require('../../client/src/pages/SavedBooks');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user.id })
          .select('-__v -password')
          .populate('savedBooks');

        return userData;

      }

      throw new AuthenticationError('Not logged in');

    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
        // creates the user
        const user = await User.create({ username, email, password });
        // signs a JSON Web Token for the user and logs the user in after they are created
        const token = signToken(user);
        // returns the signed token and user's info as an `Auth` object
        return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, args) => {
      // add parameters on line 50, col 49 ?
      const saveBook = await SavedBooks.create({ });

      await User.findOneAndUpdate(
        { $addToSet: { savedBooks: savedBook._id } }
      );

      return saveBook;
    },
    removeBook: async ( parent, { bookId }) => {
      return savedBook.findOneAndDelete({ _id: bookId });
    }
  }
};

module.exports = resolvers;