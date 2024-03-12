import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('배열을 리턴해야함', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('영화를 리턴해야함', () => {
      service.create({
        title: 'test movie',
        genres: ['test'],
        year: 2000,
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('404 에러 던짐', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Not found Movie`);
      }
    });
  });

  describe('deleteOne', () => {
    it('영화 삭제', () => {
      service.create({
        title: 'test movie',
        genres: ['test'],
        year: 2000,
      });
      const allMovies = service.getAll();
      service.deleteOne(1);
      const afterDelete = service.getAll();

      expect(afterDelete.length).toEqual(allMovies.length - 1);
    });

    it('404 에러 던짐', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Not found Movie`);
      }
    });
  });

  describe('create', () => {
    it('영화 생성', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'test movie',
        genres: ['test'],
        year: 2000,
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('영화 업데이트', () => {
      service.create({
        title: 'test movie',
        genres: ['test'],
        year: 2000,
      });
      service.update(1, { title: '업데이트 테스트' });
      const movie = service.getOne(1);
      expect(movie.title).toEqual('업데이트 테스트');
    });

    it('404 에러 던짐', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Not found Movie`);
      }
    });
  });
});
