import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly _productsService: ProductsService,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.inserUsers();
    await this.insertNewProducts(adminUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this._productsService.deleteAllProducts();

    const queryBuilder = this._userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async inserUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(
        this._userRepository.create({
          ...user,
          password: bcrypt.hashSync(user.password, 10),
        }),
      );
    });

    const dbUsers = await this._userRepository.save(users);
    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    this._productsService.deleteAllProducts();

    const products = initialData.products;

    const inserPromises = [];

    products.forEach((product) => {
      inserPromises.push(this._productsService.create(product, user));
    });

    await Promise.all(inserPromises);

    return true;
  }
}
