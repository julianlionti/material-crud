import { Request } from 'miragejs'

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toString()

const c2Response = ({ page, limit }: { page: number; limit: number }) => ({
  count: 14,
  current: page,
  next: null,
  previous: null,
  results: Array(page === 1 ? 10 : 4)
    .fill(null)
    .map((e, i) => ({
      id: page - 1 * 1 + (page === 1 ? 1 : 10) + i,
      c2_type: random(1, 3),
      creation_date: randomDate(new Date(2012, 0, 1), new Date()),
      numero: random(1, 10000),
      options: [
        { name: 'url', value: 'https://127.0.0.1:7443' },
        { name: 'username', value: 'cobbr' },
        { name: 'password', value: 'NewPassword!' },
      ],
    })),
})

const types = {
  count: 3,
  current: 1,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      name: 'empire',
      description: 'C2 developed by BC-Security',
      documentation: 'https://github.com/BC-SECURITY/Empire/wiki/RESTful-API',
      options: [
        {
          name: 'url',
          example: 'http://127.0.0.1:1337',
          description: 'URL of exposed API',
          type: 'string',
          required: 'True',
        },
        {
          name: 'password',
          example: 'Password123!',
          description: 'password corresponding with the username',
          type: 'protected-string',
          required: 'true',
        },
        {
          name: 'username',
          example: 'empireadmin',
          description: 'user provided for API handling',
          type: 'string',
          required: 'true',
        },
      ],
    },
    {
      id: 2,
      name: 'Covenant',
      description: 'C2 developed by BC-Security',
      documentation: 'https://github.com/cobbr/Covenant/wiki',
      options: [
        {
          name: 'url',
          example: 'http://127.0.0.1:7443',
          description: 'URL of exposed API',
          type: 'string',
          required: 'True',
        },
        {
          name: 'password',
          example: 'Password123!',
          description: 'password corresponding with the username',
          type: 'protected-string',
          required: 'true',
        },
        {
          name: 'username',
          example: 'covenantAdmin',
          description: 'user provided for API handling',
          type: 'string',
          required: 'true',
        },
      ],
    },
    {
      id: 3,
      name: 'Metasploit (Command Line)',
      description: "An integration with metasploit's command line tool",
      documentation: 'https://www.metasploit.com/',
      options: [
        {
          name: 'username',
          example: 'root',
          description: 'user with the privileges to utilize the c2',
          type: 'string',
          required: 'true',
        },
        {
          name: 'public IP',
          example: '192.168.101.24',
          description: 'Public IP of the server running the C2',
          type: 'string',
          required: 'true',
        },
        {
          name: 'OS',
          example: 'Ubuntu 20.04 (linux 5.4.0-53-generic)',
          description: 'Operating System of the server running the C2',
          type: 'string',
          required: 'false',
        },
      ],
    },
  ],
}

export default {
  c2Response: (schema: any, request: Request) =>
    c2Response({
      limit: parseInt(request.queryParams.limit, 0),
      page: parseInt(request.queryParams.page, 0),
    }),
  types: () => types,
}
