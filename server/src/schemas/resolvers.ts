import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';
import { ResolverArgs } from './namespace.js';


const resolvers = {
    Query: {
        // For internal testing...
        users: async () => {
            const result = await User.find({}).populate('savedBooks');

            console.log("users query result:", result);
            return result;
        },
    
        // For getting a single user. Internal testing purposes
        user: async (_parent: unknown, args: ResolverArgs.UserArgs) => {
            return await User.findById(args.userId).populate('savedBooks');
        },

        // When the user is logged in, this query retrieves info on that user
        me: async (_parent: unknown, _args: unknown, context: ResolverArgs.Context) => {
            if (context.user) {
                // This is a returning an error because we haven't properly defined our middleware yet...
                return await User.findOne({ _id: context.user._id});
            };

            throw new AuthenticationError('Not Authenticated');
        }
    },

    Mutation: {
        login: async(_parent: unknown, args: ResolverArgs.LoginArgs) => {
            const user = await User.findOne({ email: args.email});
            
            // TODO: Define AuthenticationError
            if (!user) { throw new AuthenticationError('No user associated with email.'); }
            
            const correctPw = await user.isCorrectPassword(args.password);
            if (!correctPw) { throw new AuthenticationError('Not Authenticated')};
            
            const token = signToken(user.username, user.email, user._id);
            
            return { token, user};
        },

        addUser: async (_parent: unknown, args: { input: ResolverArgs.AddUserArgs }) => {
            const { username, email, password } = args.input;
            const user = await User.create({ username, email, password, savedBooks: [] });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        // When the user is logged in, this mutation saves a new book to the user's list of books
        saveBook: async(_parent: unknown, args: { input: ResolverArgs.SaveBookArgs}, context: ResolverArgs.Context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            } else {
                throw new AuthenticationError('Not Authenticated');
            }
        },

        // When the user is logged in, this mutation deletes a book from their collection.
        deleteBook: async(_parent: unknown, args: ResolverArgs.DeleteBookArgs, context: ResolverArgs.Context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
                return updatedUser;
            } else {
                throw new AuthenticationError('Not Authenticated');
            }
        }
    }
};

export default resolvers; 