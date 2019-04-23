module.exports = {
   response: {
      application: {name: 'Smart Invoice'},
      createdAt: '2016-10-29T23:57:26.474Z',
      denomination: {pair: 'EUREUR', rate: '1.00', amount: '0.10', currency: 'EUR'},
      fees: [],
      id: '2f84c379-86e4-4402-af68-2c8f973536d2',
      message: 'Money from michael.',
      network: 'uphold',
      normalized: [{
         amount: '0.11',
         commission: '0.00',
         currency: 'USD',
         fee: '0.00',
         rate: '1.09840',
         target: 'origin'
      }],
      params: {
         currency: 'EUR',
         margin: '0.00',
         pair: 'EUREUR',
         progress: '1',
         rate: '1.00',
         ttl: 3599951,
         type: 'internal'
      },
      reference: null,
      status: 'completed',
      type: 'transfer',
      origin: {
         amount: '0.10',
         base: '0.10',
         CardId: '47c40510-0961-440f-8865-180ed5b661c1',
         commission: '0.00',
         currency: 'EUR',
         description: 'Michael Smolenski',
         fee: '0.00',
         isMember: true,
         rate: '1',
         sources: [{id: 'bc16b16e-295d-49d1-921c-ec8f58dc2dd7', amount: '0.10'}],
         type: 'card',
         username: 'mikesmo'
      },
      destination: {
         amount: '0.10',
         base: '0.10',
         commission: '0.00',
         currency: 'EUR',
         description: 'Michael Smolenski',
         fee: '0.00',
         isMember: false,
         rate: '1',
         type: 'card',
         username: 'mikesmo2'
      }
   }
};

