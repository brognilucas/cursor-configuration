import { AppDataSource } from '../config/database';
import { ProductEntity } from '../entities/ProductEntity';

async function seed(): Promise<void> {
  try {
    await AppDataSource.initialize();

    const productRepository = AppDataSource.getRepository(ProductEntity);

    const products = [
      {
        name: 'Laptop',
        price: 999.99,
        description: 'High-performance laptop with latest specs',
        sku: 'LAPTOP001'
      },
      {
        name: 'Smartphone',
        price: 699.99,
        description: 'Latest model smartphone with advanced features',
        sku: 'PHONE001'
      },
      {
        name: 'Headphones',
        price: 199.99,
        description: 'Wireless noise-canceling headphones',
        sku: 'AUDIO001'
      },
      {
        name: 'Tablet',
        price: 499.99,
        description: '10-inch tablet with retina display',
        sku: 'TABLET001'
      },
      {
        name: 'Smartwatch',
        price: 299.99,
        description: 'Fitness tracking smartwatch',
        sku: 'WATCH001'
      }
    ];

    for (const product of products) {
      const existingProduct = await productRepository.findOne({
        where: { name: product.name }
      });

      if (!existingProduct) {
        await productRepository.save(product);
        console.log(`Created product: ${product.name}`);
      } else {
        console.log(`Product ${product.name} already exists`);
      }
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 