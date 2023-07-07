import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `
  type Book {
    id: ID!
    title: String
    author: String
  }

  type Query {
    books: [Book]
    book(id: ID!): Book!
  }

  type Mutation {
    createBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBook!): Book!
    removeBook(id: ID!): Book!
  }

  input CreateBookInput {
    title: String!,
    author: String!
  }

  input UpdateBook {
    title: String,
    author: String
  }
`

const books = [
  {
    id: "1",
    title: "Mehrobdan chayon",
    author: "Abdulla Qodiriy"
  },
  {
    id: "2",
    title: "Ufq",
    author: "Chingiz Aytmatov"
  }
];

const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args, contextValue, info) => {
      const book = books.find(book => book.id === args.id);

      if (!book) {
        throw new Error(`Book not found`);
      };

      return book;
    }
  },

  Mutation: {
    createBook: (_, args) => {
      books.push({
        id: books.length + 1,
        title: args.input.title,
        author: args.input.author
      });

      return books.at(-1);
    },
    updateBook: (_, args) => {
      const book = books.find(book => book.id == args.id);
      const index = books.findIndex(book => book.id == args.id);

      if (!book) {
        throw new Error(`Book not found`);
      };

      books.splice(index, 1, { ...book, ...args.input });

      return books[index];
    },
    removeBook: (_, args) => {
      const book = books.find(book => book.id == args.id);
      const index = books.findIndex(book => book.id == args.id);

      if (!book) {
        throw new Error(`Book not found`);
      };

      books.splice(index, 1);

      return book;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

startStandaloneServer(server, { listen: { port: 8080 } })
  .then(({ url }) => console.log(url));