interface GetProps {
  page: number
  perPage: number
}

export const fakeGet = ({ page, perPage }: GetProps) => ({
  data: {
    docs: Array(page === 1 ? perPage : 3)
      .fill(null)
      .map((_, i) => ({
        _id: '5f7b22bf6ed1a340d03eedf' + i,
        nombre: 'Quesos',
        descripcion: 'Categoria de quesos',
        requiereNormativa: true,
        normativas: [
          { _id: '5f7b22bf6ed1a340d03eedfb', normativa: 'Resolucion 23/19' },
          { _id: '5f7b22bf6ed1a340d03eedfc', normativa: 'Decreto 210/10' },
        ],
        creadoEl: '2020-10-05T13:42:23.414Z',
        modificadoEl: '2020-10-05T13:42:23.414Z',
        __v: 0,
        sarsas: '',
      })),
    totalDocs: 13,
    limit: perPage,
    page: page,
    totalPages: 2,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: true,
    prevPage: null,
    nextPage: 2,
  },
})
