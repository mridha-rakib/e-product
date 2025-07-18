import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const paginateConfig: typeof mongoosePaginate.paginate.options = {
  lean: true,
  leanWithId: false,
  limit: 10,
  offset: 0,
  customLabels: {
    docs: 'data',
    totalDocs: 'total',
    meta: 'metadata',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    hasNextPage: 'hasNext',
    hasPrevPage: 'hasPrev',
  },
};

mongoosePaginate.paginate.options = paginateConfig;

export const paginatePlugin = mongoosePaginate;
export const aggregatePaginatePlugin = aggregatePaginate;
