import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface UserContext {
    _id: string;
    username: string;
    email: string;
}

interface UserArgs {
    id: string;
};

interface AddUserArgs {
    username: string;
    email: string;
    password: string;
};

interface LoginArgs {
    email: string;
    password: string;
};

interface Context {
    // TODO: We'll need to change this later...
    user?: UserContext;
}

const resolvers = {
    Query: {
        // For internal testing...
        users: async () => {
            return User.find().populate('savedBooks');
        },
    
        // For getting a single user. Internal testing purposes
        user: async (_parent: unknown, args: UserArgs) => {
            return User.findById(args.id).populate('savedBooks');
        },

        // When the user is logged in, this query retrieves info on that user
        me: async (_parent: unknown, args: unknown, context: Context) => {
            if (context.user) {
                // This is a returning an error because we haven't properly defined our middleware yet...
                return await User.findOne({ _id: context.user._id});
            };

            throw new AuthenticationError('Not Authenticated');
        }
    },

    Mutation: {
        login: async(_parent: unknown, args: LoginArgs) => {
            const user = await User.findOne({ email: args.email});
            
            // TODO: Define AuthenticationError
            if (!user) { throw new AuthenticationError('No user associated with email.'); }
            
            const correctPw = await user.isCorrectPassword(args.password);
            if (!correctPw) { throw new AuthenticationError('Not Authenticated')};
            
            const token = signToken(user.username, user.email, user._id);
            
            return { token, user};
        },

        addUser: async(_parent: unknown, args: AddUserArgs) => {
            return await User.create({
                username: args.username,
                password: args.password,
                email: args.email,
                savedBooks: []
            });
        },
    }
};

export default resolvers; 