/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('books').del()
  await knex('books').insert([
    {id: 1, title: 'The Little Book of Semaphores', author: "Allen B. Downey"},
    {id: 2, title: 'Programming Pearls', author: "Jon Bentley"},
    {id: 3, title: 'The Elements of Programming Style', author: "Brian W. Kernighan and Phillip J. Plauger"},
    {id: 4, title: 'THe New Turing Omnibus', author: "Alexander K. Dewdney"}
  ]);

  await knex.raw("select setval('books_id_seq', max(books.id)) from books");
};
