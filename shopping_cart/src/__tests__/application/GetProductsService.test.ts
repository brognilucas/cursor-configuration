import { FakeProductRepository } from '../repositories/FakeProductRepository';
import { GetProductsService } from '../../application/GetProductsService';
import { Product } from '../../domain/Product';

describe('GetProductsService', () => {
  it('returns all products from repository', async () => {
    const repository = new FakeProductRepository();
    const service = new GetProductsService(repository);
    
    const products = await service.execute();
    
    expect(products).toEqual([]);
  });

  it('returns products when repository has data', async () => {
    const repository = new FakeProductRepository();
    const product = new Product('1', 'Test Product', 10);
    await repository.save(product);
    const service = new GetProductsService(repository);
    
    const products = await service.execute();
    
    expect(products).toEqual([product]);
  });
}); 