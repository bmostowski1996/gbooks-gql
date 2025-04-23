export namespace ResolverArgs {
    export interface UserContext {
        _id: string;
        username: string;
        email: string;
    };

    export interface UserArgs {
        userId: string;
    };

    export interface AddUserArgs {
        username: string;
        email: string;
        password: string;
    };

    export interface LoginArgs {
        email: string;
        password: string;
    };

    export interface SaveBookArgs {
        // authors: [String];
        description: string;
        bookId: string;
        title: string;
    };

    export interface DeleteBookArgs {
        bookId: string;
    }

    export interface Context {
        // TODO: We'll need to change this later...
        user?: UserContext;
    };
}