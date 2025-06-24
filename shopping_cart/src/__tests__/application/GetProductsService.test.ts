import { GetProductsService } from '../../application/GetProductsService';
import { FakeProductRepository } from '../repositories/FakeProductRepository';

describe('GetProductsService', () => {
  it('returns all products from repository', async () => {
    const repository = new FakeProductRepository();
    const service = new GetProductsService(repository);
    
    const products = await service.execute();
    
    expect(products).toEqual([]);
  });
}); 