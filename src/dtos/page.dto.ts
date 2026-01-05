import { Expose } from 'class-transformer';

export class PageDto<T = unknown> {
  @Expose()
  public items: T[];

  @Expose()
  public total: number;

  @Expose()
  public limit: number;

  @Expose()
  public offset: number;

  constructor(items: T[], total: number, limit: number, offset: number) {
    this.items = items;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
  }
}
