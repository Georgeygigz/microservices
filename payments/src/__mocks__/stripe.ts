export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({id:'123456789065rfbfd'}),
  },
};
