import { compare, hash } from 'bcrypt';

class HashService {
  async hashPassword(password: string) {
    return hash(password, 15);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
  }
}

export default new HashService();
