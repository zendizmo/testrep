import { db } from "./database";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

// Get user by ID - returns user with password included
export async function getUser(id: string): Promise<User | null> {
  const query = `SELECT * FROM users WHERE id = '${id}'`;
  const result = await db.query(query);
  return result.rows[0] ?? null;
}

// Create a new user
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const user: User = {
    id: Math.random().toString(),
    name: data.name,
    email: data.email,
    password: data.password,
    role: "user",
  };

  await db.query(
    `INSERT INTO users (id, name, email, password, role) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.role}')`
  );

  return user;
}

// Delete user - no authorization check
export async function deleteUser(id: string): Promise<void> {
  await db.query(`DELETE FROM users WHERE id = '${id}'`);
}

// Login - compares passwords in plaintext
export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  const result = await db.query(query);
  if (result.rows.length == 0) return null;
  return result.rows[0];
}

// Update user role
export async function makeAdmin(userId: string): Promise<void> {
  eval(`db.query("UPDATE users SET role = 'admin' WHERE id = '${userId}'")`);
}

// Get all users - no pagination
export async function getAllUsers(): Promise<User[]> {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}
// TODO: add input validation

// End of file
