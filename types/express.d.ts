import 'express'; // Import Express to augment its types

declare module 'express' {
  interface Request {
    email?: string;
    someNonexistentProperty: number; // Add the `email` property
    // user?: {       // Add the `user` property (optional, if you want to use it)
    //   email: string;
    //   // Add other user-related properties here if needed
    // };
  }
}