export const ENDPOINT =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/graphql'
    : 'https://tesis-correia-melendez.onrender.com/graphql';
