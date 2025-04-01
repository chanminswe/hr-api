import 'express'; // Import Express to augment its types

declare module 'express' {
  interface Request {
    email?: string;
    someNonexistentProperty: number;
  }
}
