import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

import { ProductsService } from './products.service';

import { Product } from '../database/models/product.model';

const mockProduct = {
  _id: '1',
  product_image_md: 'img.png',
  product_type: 'type1',
  product_name: 'Test Product',
  product_department: 'Dept',
  product_stock: 10,
  product_color: 'red',
  product_price: 100,
  product_material: 'wood',
  product_ratings: 4,
  product_sales: 20,
};

const mappedProduct = {
  id: '1',
  imgPath: 'img.png',
  productType: 'type1',
  displayName: 'Test Product',
  department: 'Dept',
  stock: 10,
  color: 'red',
  price: 100,
  material: 'wood',
  ratings: 4,
  sales: 20,
};

const mockExternalResponse = {
  data: {
    success: true,
    page: 1,
    lastPage: 1,
    data: [mockProduct],
  },
};

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

const mockDbModel = {
  findAndCountAll: jest.fn(),
  bulkCreate: jest.fn(),
  sequelize: {
    transaction: () => mockTransaction,
  },
};

const mockHttpService = {
  get: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product),
          useValue: mockDbModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startDbSync', () => {
    it('should sync products from all pages', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockExternalResponse));

      const upsertSpy = jest.spyOn<ProductsService, any>(
        service,
        'upsertProducts',
      );

      await service.startDbSync();

      expect(mockHttpService.get).toHaveBeenCalled();
      expect(upsertSpy).toHaveBeenCalledWith([mappedProduct]);
    });

    it('should throw if sync is already in progress', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockExternalResponse));
      void service.startDbSync();
      await expect(service.startDbSync()).rejects.toThrow(BadRequestException);
    });

    it('should handle axios error gracefully', async () => {
      const axiosError = {
        response: {
          data: 'Not found',
        },
        isAxiosError: true,
        toJSON: () => ({}),
      };

      mockHttpService.get.mockReturnValueOnce(throwError(() => axiosError));

      await expect(service.startDbSync()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const paginationParams = { page: 1, limit: 10 };
      const mockRows = [{ id: '1', name: 'product1' }];
      const mockCount = 1;

      mockDbModel.findAndCountAll.mockResolvedValueOnce({
        rows: mockRows,
        count: mockCount,
      });

      const result = await service.findAll(paginationParams);

      expect(result).toEqual({
        items: mockRows,
        total: mockCount,
        limit: 10,
        page: 1,
        nextPage: null,
      });
    });
  });

  describe('upsertProducts', () => {
    it('should upsert products in transaction', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockExternalResponse));
      mockDbModel.bulkCreate.mockResolvedValueOnce(undefined);

      await service.startDbSync();

      expect(mockDbModel.bulkCreate).toHaveBeenCalledWith([mappedProduct], {
        updateOnDuplicate: [
          'imgPath',
          'productType',
          'displayName',
          'department',
          'stock',
          'color',
          'price',
          'material',
          'ratings',
          'sales',
        ],
        transaction: mockTransaction,
      });
    });

    it('should throw and log on error', async () => {
      mockHttpService.get.mockReturnValueOnce(of(mockExternalResponse));
      mockDbModel.bulkCreate.mockRejectedValueOnce(new Error('DB error'));

      const loggerSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(service.startDbSync()).rejects.toThrow();
      loggerSpy.mockRestore();
    });
  });
});
